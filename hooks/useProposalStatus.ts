"use client";

import { useEffect, useState } from "react";
import { isAddress } from "viem";
import { usePublicClient } from "wagmi";
import type { ProposalItem } from "@/hooks/useProposalList";
import { daoForumContract } from "@/lib/contracts";

type UseProposalStatusArgs = {
  proposalId: number | null;
  address?: string;
  refreshSignal?: number;
};

export function useProposalStatus({
  proposalId,
  address,
  refreshSignal
}: UseProposalStatusArgs) {
  const publicClient = usePublicClient();
  const [proposal, setProposal] = useState<ProposalItem | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      if (!publicClient || proposalId === null || proposalId < 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = (await publicClient.readContract({
          ...daoForumContract,
          functionName: "proposals",
          args: [BigInt(proposalId)]
        })) as readonly [string, bigint, bigint];

        if (!cancelled) {
          setProposal({
            id: proposalId,
            title: result[0],
            yes: result[1],
            no: result[2]
          });
        }

        if (address && isAddress(address)) {
          const voted = await publicClient.readContract({
            ...daoForumContract,
            functionName: "voted",
            args: [BigInt(proposalId), address]
          });
          if (!cancelled) {
            setHasVoted(Boolean(voted));
          }
        } else if (!cancelled) {
          setHasVoted(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to read proposal");
          setProposal(null);
          setHasVoted(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStatus().catch((err) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "Failed to read proposal");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [address, proposalId, publicClient, refreshSignal]);

  return { proposal, hasVoted, loading, error };
}
