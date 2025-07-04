import { useState } from "react";

import type { HashParamSchema } from "@/modules/checkout/schemas/hash-param-schema";

export function usePayment() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function redirectToPayment(values: HashParamSchema & { hash: string }) {
    setIsLoading(true);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://test.payu.in/_payment";

    for (const [key, value] of Object.entries(values)) {
      if (value) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  }

  return {
    isLoading,
    redirectToPayment,
  };
}
