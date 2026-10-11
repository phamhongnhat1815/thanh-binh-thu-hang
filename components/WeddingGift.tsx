"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { weddingConfig } from "../lib/wedding-config";
export default function WeddingGift() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const gift = weddingConfig.gift;
  useEffect(() => setMounted(true), []);
  const close = () => {
    dialog.current?.close();
    setCopied(false);
    trigger.current?.focus();
  };
  return (
    <section className="wedding-gift">
      <p>Gửi yêu thương đến chúng mình</p>
      <button
        ref={trigger}
        className="gift-trigger"
        onClick={() => dialog.current?.showModal()}
      >
        Thông tin mừng cưới <span aria-hidden="true">♡</span>
      </button>
      {mounted &&
        createPortal(
          <dialog
            ref={dialog}
            className="gift-dialog"
            aria-labelledby="gift-title"
            onCancel={close}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="gift-dialog-panel">
              <button
                className="gift-close"
                aria-label="Đóng thông tin mừng cưới"
                onClick={close}
              >
                ×
              </button>
              <p className="gift-kicker">WITH LOVE</p>
              <h2 id="gift-title">Thông tin mừng cưới</h2>
              <div className="gift-divider" />
              <dl>
                <div>
                  <dt>Số tài khoản</dt>
                  <dd>{gift.accountNumber || "Chưa cập nhật"}</dd>
                </div>
                <div>
                  <dt>Chủ tài khoản</dt>
                  <dd>{gift.accountHolder || "Chưa cập nhật"}</dd>
                </div>
                <div>
                  <dt>Ngân hàng</dt>
                  <dd>{gift.bankName || "Chưa cập nhật"}</dd>
                </div>
              </dl>
              {gift.accountNumber && (
                <button
                  className="gift-copy"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(gift.accountNumber);
                      setCopied(true);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? "Đã sao chép" : "Sao chép số tài khoản"}
                </button>
              )}
              <p className="gift-thanks">
                Cảm ơn bạn đã dành tình cảm cho chúng mình!
              </p>
            </div>
          </dialog>,
          document.body,
        )}
    </section>
  );
}
