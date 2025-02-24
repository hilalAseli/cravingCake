const convertGoogleDrive = (url) => {
  if (!url) return null;
  const convertData = url.split("/file/d/")[1]?.split("/")[0];
  return `https://drive.google.com/uc?export=view&id=${convertData}`;
};
export default convertGoogleDrive;
