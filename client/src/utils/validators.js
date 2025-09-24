export function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function validatePassword(password) {
  return password.length >= 6;
}

export function validateProposal(proposal) {
  if (!proposal.title || proposal.title.length < 5) {
    return "Proposal title must be at least 5 characters";
  }
  if (!proposal.description || proposal.description.length < 20) {
    return "Proposal description must be at least 20 characters";
  }
  return null; // no errors
}
