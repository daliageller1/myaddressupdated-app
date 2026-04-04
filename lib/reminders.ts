export function getReminder(moveDate: Date) {
  const now = new Date();

  const daysLeft = Math.ceil(
    (moveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft <= 0) {
    return {
      title: "Your move is today!",
      daysLeft,
      suggestions: [
        "Do a final walkthrough",
        "Check all rooms",
      ],
    };
  }

  if (daysLeft <= 7) {
    return {
      title: `Confirm movers — ${daysLeft} days left`,
      daysLeft,
      suggestions: [
        "Call moving company",
        "Confirm time",
      ],
    };
  }

  if (daysLeft <= 14) {
    return {
      title: `Start packing — ${daysLeft} days left`,
      daysLeft,
      suggestions: [
        "Pack non-essential items",
        "Label boxes",
      ],
    };
  }

  if (daysLeft <= 30) {
    return {
      title: `Notify utilities — ${daysLeft} days left`,
      daysLeft,
      suggestions: [
        "Electricity",
        "Internet",
        "Water & gas",
      ],
    };
  }

  return null;
}
