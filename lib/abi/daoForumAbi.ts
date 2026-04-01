export const daoForumAbi = [
  {
    type: "function",
    name: "createProposal",
    stateMutability: "nonpayable",
    inputs: [{ name: "title", type: "string" }],
    outputs: []
  },
  {
    type: "function",
    name: "vote",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "support", type: "bool" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "proposals",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "title", type: "string" },
      { name: "yes", type: "uint256" },
      { name: "no", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "voted",
    stateMutability: "view",
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "address" }
    ],
    outputs: [{ type: "bool" }]
  }
] as const;
