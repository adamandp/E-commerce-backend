import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma.service';
import { Response, Request } from 'express';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './auth.validation';
import {
  customRequest,
  JwtPayload,
  WebResponse,
} from 'src/common/common.interface';
import { cookieConfig, maxAge } from 'src/config/cookie.config';
import { browserInfo } from 'src/utils/browser-info';
import { ErrorMessage } from 'src/utils/messages';
import { secret } from 'src/config/secret.config';
import { JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/model/user/user.service';
import { UserRolesService } from '../user-roles/user-roles.service';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { PinoLogger } from 'nestjs-pino';
import { throwError } from 'src/utils/throwError';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logger: PinoLogger,
    private readonly user: UserService,
    private readonly userRoles: UserRolesService,
    private readonly userPermission: UserPermissionService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  jwtConfig = {
    access: <JwtSignOptions>{
      secret: secret.key.jwt.access,
      expiresIn: '15m',
    },
    refresh: <JwtSignOptions>{
      secret: secret.key.jwt.refresh,
      expiresIn: '7d',
    },
  };

  private async validatePassword(requestPassword: string, password: string) {
    return await bcrypt
      .compare(requestPassword, password)
      .then((res) => {
        if (!res) {
          throw new UnauthorizedException(ErrorMessage.validation('Password'));
        }
      })
      .catch((error) => {
        this.logger.error(error);
        throwError(
          ErrorMessage.validation('Password'),
          InternalServerErrorException,
        );
      });
  }

  private async createAccessToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService
      .signAsync(payload, this.jwtConfig.access)
      .catch((error) => {
        this.logger.error(error);
        throwError(
          ErrorMessage.create('Access Token'),
          InternalServerErrorException,
        );
      });
  }

  private async createRefreshToken(
    payload: JwtPayload,
    req: Request,
  ): Promise<string> {
    const refreshToken = await this.jwtService
      .signAsync(payload, this.jwtConfig.refresh)
      .catch((error) => {
        this.logger.error(error);
        throwError(
          ErrorMessage.create('Refresh Token'),
          InternalServerErrorException,
        );
      });

    return await this.prisma.userToken
      .create({
        data: {
          userId: payload.sub,
          refreshToken: refreshToken,
          expiresAt: new Date(Date.now() + maxAge.refresh),
          browserInfo: JSON.stringify(browserInfo(req)),
        },
      })
      .then((res) => res.refreshToken);
  }

  async login(
    request: LoginDto,
    req: Request,
    res: Response,
  ): Promise<WebResponse> {
    const user = await this.user.findByIdentifier(request.identifier);
    const userRoles = await this.userRoles.findByUserId(user.id);
    const userPermission = await this.userPermission.findByUserId(user.id);
    await this.validatePassword(request.password, user.password);
    const payload = {
      sub: user.id,
      role: userRoles.data?.roles?.id as string,
      permissions: userPermission.data?.userPermission.map(
        (p) => p.permission?.id,
      ) as string[],
    };
    await Promise.all([
      res.cookie(
        'accessToken',
        await this.createAccessToken(payload),
        cookieConfig.access,
      ),
      res.cookie(
        'refreshToken',
        await this.createRefreshToken(payload, req),
        cookieConfig.refresh,
      ),
    ]);
    return {
      message: `🔓 Welcome back, ${user.fullName ?? request.identifier}! You have logged in successfully! 🎉`,
    };
  }

  async logout(req: customRequest, res: Response) {
    const refreshToken = req.cookies.refreshToken as string;
    const payload: JwtPayload = await this.jwtService.verifyAsync(
      refreshToken,
      this.jwtConfig.refresh,
    );
    return await this.prisma.userToken
      .deleteMany({
        where: { userId: payload.sub },
      })
      .then(() => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return { message: 'Logout success' };
      });
  }

  async refreshAccessToken(req: customRequest): Promise<string> {
    const refreshToken = req.cookies.refreshToken;
    const payload: JwtPayload = await this.jwtService.verifyAsync(
      refreshToken as string,
      this.jwtConfig.refresh,
    );
    return await this.createAccessToken({
      sub: payload.sub,
      role: payload.role,
      permissions: payload.permissions,
    });
  }
}
