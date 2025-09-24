// mock AI helpers (later integrate OpenAI or ML models)
export const scoreProposal = (proposal) => {
  return {
    novelty: Math.random() * 10,
    feasibility: Math.random() * 10,
    budgetCompliance: Math.random() * 10,
  };
};
