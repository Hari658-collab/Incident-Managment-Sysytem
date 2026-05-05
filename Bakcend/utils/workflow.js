// utils/workflow.js

const allowedTransitions = {
  OPEN: ["INVESTIGATING"],
  INVESTIGATING: ["RESOLVED"],
  RESOLVED: ["CLOSED"],
  CLOSED: []
};

function isValidTransition(currentStatus, newStatus) {
  return allowedTransitions[currentStatus]?.includes(newStatus);
}

module.exports = { isValidTransition };