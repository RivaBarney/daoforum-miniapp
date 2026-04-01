"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { daoForumContract } from "@/lib/contracts";

export type ProposalItem = {
  id: number;
  title: string;
  yes: bigint;
  no: bigint;
};

const DEFAULT_SCAN_LIMIT = 20;

export function useProposalList(scanLimit = DEFAULT_SCAN_LIMIT) {
  const publicClient = usePublicClient();
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const limit = useMemo(
    () => Math.max(1, Math.min(30, scanLimit)),
    [scanLimit]
  );

  const refresh = useCallback(() => {
    setRefreshTick((v) => v + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchList() {
      if (!publicClient) {
        return;
      }

      setLoading(true);
      setError(null);
      const next: ProposalItem[] = [];

      for (let i = 0; i < limit; i += 1) {
        try {
          const result = (await publicClient.readContract({
            ...daoForumContract,
            functionName: "proposals",
            args: [BigInt(i)]
          })) as readonly [string, bigint, bigint];

          next.push({
            id: i,
            title: result[0],
            yes: result[1],
            no: result[2]
          });
        } catch {
          break;
        }
      }

      if (!cancelled) {
        setProposals(next.reverse());
        setLoading(false);
      }
    }

    fetchList().catch((err) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "Failed to load proposals");
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [limit, publicClient, refreshTick]);

  return {
    proposals,
    loading,
    error,
    refresh
  };
}
