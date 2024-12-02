import { Check, Copy } from "lucide-react";
import React from "react";
import QRCode from "react-qr-code";
import { useUser } from "../state/user";
import { copyToClipboard, syncCode } from "../utils/utils";
import { Modal } from "./Modal";

interface Props {
  onClose?: () => void;
}
export const SyncModal: React.FC<Props> = ({ onClose }) => {
  const { id } = useUser();
  const syncURL = `${process.env.REACT_APP_PUBLIC_URL}/sync?id=${id}`;
  const [syncValue, setSyncValue] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }, [copied]);

  return (
    <Modal onClose={onClose}>
      <div className="text-center text-xl font-bold">Sync</div>

      <div
        className="flex cursor-pointer items-center"
        onClick={() => {
          copyToClipboard(id || "");
          setCopied(true);
        }}
      >
        <div className="w-full rounded-l-md bg-black p-2">{id}</div>
        <div className="h-full w-fit rounded-r-md bg-black p-2">
          {copied ? <Check /> : <Copy />}
        </div>
      </div>

      <QRCode value={syncURL} className="m-auto rounded-md bg-white p-2" />

      <div className="flex items-center gap-2">
        <span className="bg-gray h-[1px] w-full" />
        <span className="text-light-gray text-sm">OR</span>
        <span className="bg-gray h-[1px] w-full" />
      </div>

      <input
        value={syncValue}
        onChange={(e) => setSyncValue(e.target.value)}
        placeholder="Enter a sync code"
        className="rounded-md border-none bg-black px-2 py-1 outline-none"
      />
      <button
        className="rounded-md bg-white px-4 py-1 font-bold text-black duration-100 hover:bg-opacity-80"
        onClick={() => {
          if (!syncValue) return;

          syncCode(syncValue);
          window.location.reload();
        }}
      >
        Sync!
      </button>
    </Modal>
  );
};
