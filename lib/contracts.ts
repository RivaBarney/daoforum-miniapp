import { type Address } from "viem";
import { Attribution } from "ox/erc8021";
import { daoForumAbi } from "@/lib/abi/daoForumAbi";
import { BUILDER_CODE, DAOFORUM_CONTRACT_ADDRESS } from "@/lib/constants";

export const DAOFORUM_ADDRESS = DAOFORUM_CONTRACT_ADDRESS as Address;

export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE]
});

export const daoForumContract = {
  address: DAOFORUM_ADDRESS,
  abi: daoForumAbi
} as const;
