export const regex = {
  phone: /^\d{10,15}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i,
  username: /^[a-zA-Z0-9]{3,20}$/,
  imageUrl:
    /^(https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,6}\/(?:[\w-]+\/)*([\w-]+\.(?:jpg|jpeg|png|gif|bmp|svg|webp|tiff|ico))(\?[^\s]*)?(#\S*)?$/i,
};
