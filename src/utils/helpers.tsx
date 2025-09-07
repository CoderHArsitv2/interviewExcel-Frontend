import dayjs from 'dayjs';


export function formatDateForInput(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  console.log(`${year}-${month}-${day}`)
  return `${year}-${month}-${day}`; // "YYYY-MM-DD"
}

export const formatDate = (dateString: string) => {
  if (!dateString) {
    return "";
  }
  const date = dayjs(dateString);
  const formattedDate = date.format('MMM D, YYYY');
  return formattedDate;
};