export const parseObject = (input: any): string => {
  if (typeof input === 'string') {
    return input;
  }
  try {
    return JSON.stringify(input, null, 2);
  } catch {
    return String(input);
  }
};

export const parseLearnersCount = (learners: string): number =>
  learners.split(/[\n,]/).filter((l) => l.trim()).length;

export const filterCertificates = <T extends { username: string; email: string }>(
  data: T[],
  filterFn: (item: T) => boolean,
  search: string,
): T[] => {
  const searchLower = search.toLowerCase();
  return data.filter((item) => {
    const matchesSearch = !search
      || item.username.toLowerCase().includes(searchLower)
      || item.email.toLowerCase().includes(searchLower);
    return filterFn(item) && matchesSearch;
  });
};
