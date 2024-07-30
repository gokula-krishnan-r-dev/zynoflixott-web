export function timeAgoString(publishedAt: any) {
  if (!(publishedAt instanceof Date)) {
    console.log("publishedAt is not a Date object");
  }

  const formattedDate = new Date(publishedAt);

  const secondsAgo = Math.floor((Date.now() - formattedDate.getTime()) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;

  if (secondsAgo < minute) {
    return `${secondsAgo} sec ago`;
  } else if (secondsAgo < hour) {
    const minutes = Math.floor(secondsAgo / minute);
    return `${minutes} min ago`;
  } else if (secondsAgo < day) {
    const hours = Math.floor(secondsAgo / hour);
    return `${hours} hour ago`;
  } else if (secondsAgo < month) {
    const days = Math.floor(secondsAgo / day);
    return `${days} day ago`;
  } else {
    const months = Math.floor(secondsAgo / month);
    return `${months} month ago`;
  }
}

export function convertMinutesToReadableFormat(
  minutes: number,
  isMin: boolean
): string {
  if (minutes < 0) {
    throw new Error("Negative values are not allowed.");
  }

  const totalSeconds = Math.round(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSecondsAfterHours = totalSeconds % 3600;
  const mins = Math.floor(remainingSecondsAfterHours / 60);
  const seconds = remainingSecondsAfterHours % 60;

  if (isMin) {
    if (minutes < 1) {
      return `${totalSeconds} second${totalSeconds !== 1 ? "s" : ""}`;
    } else {
      return `${Math.round(minutes)} min${
        Math.round(minutes) !== 1 ? "s" : ""
      }`;
    }
  }

  let result = "";

  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""}`;
    if (mins > 0 || seconds > 0) {
      result += " ";
    }
  }

  if (mins > 0) {
    result += `${mins} min${mins > 1 ? "s" : ""}`;
    if (seconds > 0) {
      result += " ";
    }
  }

  if (seconds > 0 || result === "") {
    result += `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return result;
}

export function isMonthMembershipCompleted(startDate: string): boolean {
  // Parse the input date
  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    console.log("isMembership", start);
  }
  console.log("isMembership", start);

  // Get the current date
  const now = new Date();

  // Calculate the difference in milliseconds
  const diff = now.getTime() - start.getTime();

  console.log("isMembership", diff);

  // Calculate the difference in days
  const diffDays = diff / (1000 * 60 * 60 * 24);
  console.log("isMembership", diffDays);

  // Check if the difference is 30 days or more
  return diffDays >= 30;
}
