"use client";

import { useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { DAOFORUM_APP_ID } from "@/lib/constants";
import { daoForumContract, DATA_SUFFIX } from "@/lib/contracts";
import { trackTransaction } from "@/utils/track";

export function useTrackedCreateProposal() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const createProposalTracked = useCallback(
    async (title: string) => {
      const txHash = await writeContractAsync({
        ...daoForumContract,
        functionName: "createProposal",
        args: [title],
        dataSuffix: DATA_SUFFIX
      });

      void trackTransaction(DAOFORUM_APP_ID, "DAOForum", address, txHash);
      return txHash;
    },
    [address, writeContractAsync]
  );

  return { createProposalTracked, isPending };
}
