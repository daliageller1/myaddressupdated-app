export function getReminder(moveDate: Date) {
  const now = new Date();

  const daysLeft = Math.ceil(
    (moveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 🚨 ALWAYS return something (this is the key fix)

  const dayLabel = daysLeft === 1 ? "day" : "days";

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

  if (daysLeft <= 3) {
    return {
      title: `Final prep — ${daysLeft} ${dayLabel} left`,
      daysLeft,
      suggestions: [
        "Pack essentials bag",
        "Confirm moving time",
      ],
    };
  }

  if (daysLeft <= 7) {
    return {
      title: `Confirm movers — ${daysLeft} ${dayLabel} left`,
      daysLeft,
      suggestions: [
        "Call moving company",
        "Prepare payment",
      ],
    };
  }

  if (daysLeft <= 14) {
    return {
      title: `Start packing — ${daysLeft} ${dayLabel} left`,
      daysLeft,
      suggestions: [
        "Pack non-essential items",
        "Label boxes",
      ],
    };
  }

  if (daysLeft <= 30) {
    return {
      title: `Notify utilities — ${daysLeft} ${dayLabel} left`,
      daysLeft,
      suggestions: [
        "Electricity",
        "Internet",
        "Water & gas",
      ],
    };
  }

  // ✅ NEW: handle far future
  return {
    title: `Your move is in ${daysLeft} ${dayLabel}`,
    daysLeft,
    suggestions: [
      "Start planning your move",
      "Research moving companies",
    ],
  };
}
