import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `${Date.now()}-${file.name}`;
  console.log(filename);
  console.log("upload");
  const stored = await Storage.vault
    .put(filename, file, {
      contentType: file.type,
    })
    .catch((error) => console.log(error));
  console.log(stored.key);
  return stored.key;
}
