export const HttpMessage = {
  createMessage: (message: string) =>
    `🎉 ${message} created successfully! Welcome aboard! 🚀`,
  getMessage: (message: string) =>
    `📦 ${message} retrieved successfully! Smooth sailing! 😎`,
  updateMessage: (message: string) =>
    `🔄 ${message} updated successfully! Looking fresh! ✨`,
  deleteMessage: (message: string) =>
    `🗑️ ${message} deleted successfully! Sayonara! 👋`,
  setCookie: (cookieName: string) =>
    `🍪 ${cookieName} set successfully! Enjoy your stay! 😋`,
};

export const Messages = {
  create: (message: string) =>
    `🎉 ${message} created successfully! Welcome aboard! 🚀`,
  get: (message: string) =>
    `📦 ${message} retrieved successfully! Smooth sailing! 😎`,
  update: (message: string) =>
    `🔄 ${message} updated successfully! Looking fresh! ✨`,
  delete: (message: string) =>
    `🗑️ ${message} deleted successfully! Sayonara! 👋`,
  setCookie: (cookieName: string) =>
    `🍪 ${cookieName} set successfully! Enjoy your stay! 😋`,
};

// ERROR MESSAGES

export const ErrorMessage = {
  create: (resource: string) =>
    `❌ Oops! Failed to create ${resource}. Try again later! 🤦‍♂️`,
  get: (resource: string) =>
    `🚨 Whoops! Couldn't retrieve ${resource}. Maybe it's playing hide and seek? 🤔`,
  update: (resource: string) =>
    `⚠️ Failed to update ${resource}. Maybe it doesn't like change! 😅`,
  delete: (resource: string) =>
    `🛑 Failed to delete ${resource}. Looks like it's refusing to leave! 😭`,
  strictDelete: (resource: string) =>
    `❌ Cannot delete ${resource}! At least one ${resource} is required to keep the system functional. 🔒`,
  strictAdd: (resource: string) =>
    `❌ Cannot create ${resource}! ${resource} already exists and cannot be duplicated. 🔒`,
  alreadyExist: (model: string, field?: string) =>
    `⚡ ${model}${field ? ` ${field}` : ''} already exists! No duplicates allowed! 😆`,
  notFound: (model: string, field?: string) =>
    `🔍 ${model}${field ? ` ${field}` : ''} not found. Maybe it teleported to another dimension? 🛸`,
  validation: (resource: string) =>
    `🤷‍♂️ Validation failed for ${resource}. Check your input and try again! 🔍`,
  accessDenied: (resource: string) =>
    `🔒 Access Denied! Your ${resource} does not have permission to access this resource. 🚫`,
  sessionExpired: () =>
    `⏳ Your session has expired. Please log in again to continue. 🔄`,
  upload: (resource: string) =>
    `📤 Oops! Failed to upload ${resource}. Please try again later! 🚧`,
  notLoggedIn: `🚪 You are not logged in. Please sign in to continue! 🔐`,
  alreadyLoggedIn: `✅ You are already logged in. No need to log in again! 🎉`,
};

export const ZodErrorMessages = {
  required: (field: string) =>
    `⚠️ ${field} is required. Don't leave it blank! 🚨`,
  minLength: (field: string, min: number) =>
    `🔡 ${field} must be at least ${min} characters. Keep going! 💪`,
  maxLength: (field: string, max: number) =>
    `🚀 Whoa! ${field} is too long. Maximum allowed is ${max} characters! ✍️`,
  noSpaces: (field: string) =>
    `🚫 ${field} cannot contain spaces. Try again! ⛔`,
  specialChar: (field: string) =>
    `🔒 ${field} must include a special character (!@#$%^&*). Stay secure! 🛡️`,
  lowercase: (field: string) =>
    `🔠 ${field} must include at least one lowercase letter (a-z). Don't forget! ✏️`,
  uppercase: (field: string) =>
    `🔡 ${field} must include at least one uppercase letter (A-Z). Level up! 🔝`,
  number: (field: string) =>
    `🔢 ${field} must include at least one number (0-9). Add some digits! 📈`,
  booleanRequired: (field: string) =>
    `🟢 ${field} must be true or false. No in-between! ⚪`,
  invalidFormat: (field: string) =>
    `🎭 ${field} format is invalid. Check again! 🔄`,
  invalidString: (field: string) =>
    `📜 ${field} must be a valid text. No weird symbols! 🚫`,
  invalidNumber: (field: string) =>
    `🔢 ${field} must be a valid number. No funky math here! 🚫`,
  invalidDate: (field: string) =>
    `📅 ${field} must be a valid date. Time travel not allowed! ⏳`,
  invalidArray: (field: string) =>
    `📦 ${field} must be a list of items. Not just one! 📋`,
  invalidObject: (field: string) =>
    `🛠️ ${field} must be a valid object. Structure matters! 🏗️`,
  invalidBoolean: (field: string) =>
    `⚖️ ${field} must be either true or false. No Schrödinger values! 🐱`,
  invalidUUID: (field: string) =>
    `🆔 ${field} must be a valid UUID. No random gibberish! 🔢`,
  invalidURL: (field: string) =>
    `🌍 ${field} must be a valid URL. Where are you trying to go? 🚀`,
  invalidEnum: (field: string, values: readonly string[]) =>
    `🎭 ${field} must be one of the following: ${values.join(', ')}. Choose wisely! 🎯`,
  priceTooLow: (field: string) =>
    `💰 ${field} must be at least Rp1.000. Don't be cheap! 🤑`,
  priceTooHigh: (field: string) =>
    `💰 ${field} must be less than Rp1,000,000. Don't be greedy! 🤑`,
  nameOnlyLetters: 'Just letters & spaces, no secret codes! 🤨',
  invalidPhone: `📞 Invalid phone number! Double-check and try again! 🤳`,
  invalidEmail: `📧 Invalid email format! Try something like user@example.com ✉️`,
  invalidGender: `⚧️ Gender must be either 'MAN', 'WOMAN', or 'OTHER'. Choose wisely! 🌈`,
  passwordMismatch: `🔐 Passwords do not match! Make sure they are identical. 🔁`,
  invalidUUIDParam: `🆔 must be a valid UUID. No random gibberish! 🔢`,
};
