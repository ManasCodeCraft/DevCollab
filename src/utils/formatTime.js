
export function formatDateForInvite(date) {
    const dateObj = new Date(date);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }