const DEFAULT_MAX_FILE_SIZE_MB = 200;

function readMaxFileSizeMb() {
  const configuredValue =
    process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ?? process.env.MAX_FILE_SIZE_MB;
  const parsedValue = Number.parseInt(configuredValue ?? "", 10);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : DEFAULT_MAX_FILE_SIZE_MB;
}

export const MAX_FILE_SIZE_MB = readMaxFileSizeMb();
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_FILE_SIZE_LABEL = `${MAX_FILE_SIZE_MB}MB`;
