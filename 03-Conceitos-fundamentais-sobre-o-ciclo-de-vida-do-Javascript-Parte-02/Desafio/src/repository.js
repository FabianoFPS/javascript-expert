import { writeFile, readFile } from "node:fs/promises";

export const save = async (data) => {
  const databaseFile = getFilePath('../database.json');
  const currentData = JSON.parse((await readFile(databaseFile)));
  currentData.push(data);

  await writeFile(databaseFile, JSON.stringify(currentData));
};

function getFilePath(file) {
  const { pathname } = new URL('../database.json', import.meta.url);
  return pathname;
}