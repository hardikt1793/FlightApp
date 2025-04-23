export const parseFlightDetailsFromEmail = (buffer: string) => {
  const extract = (regex: RegExp, text: string): string | null => {
    const match = text.match(regex);
    return match?.[1]?.trim() || null;
  };

  const flightNumber =
    extract(/Flight\s*Number[:\-]?\s*([A-Z]{2}[0-9]{1,4})\b/i, buffer) ||
    extract(/\b([A-Z]{2}[0-9]{1,4})\b(?!\s*[a-z])/i, buffer);

  console.log('Parsed Flight Details:', {
    flightNumber,
  });

  return {
    flightNumber: flightNumber?.toUpperCase() || null,
  };
};
