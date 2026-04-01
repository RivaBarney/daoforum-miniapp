"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { StatusChip } from "@/components/StatusChip";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <section className="wallet-panel">
        <StatusChip label="Wallet connected" tone="success" />
        <div className="wallet-panel__row">
          <span className="wallet-panel__address">{shortAddress(address)}</span>
          <button type="button" className="btn btn--ghost" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="wallet-panel">
      <StatusChip label="Wallet not connected" tone="neutral" />
      <div className="wallet-panel__actions">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            type="button"
            className="btn"
            disabled={isPending}
            onClick={() => connect({ connector })}
          >
            Connect {connector.name}
          </button>
        ))}
      </div>
    </section>
  );
}
