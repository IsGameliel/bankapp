"use client";

import { useEffect } from "react";

export default function SupportWidget() {
  useEffect(() => {
    const tawkId = process.env.NEXT_PUBLIC_TAWK_TO_ID;
    const hubspotId = process.env.NEXT_PUBLIC_HUBSPOT_ID;

    // Tawk.to snippet (only if NEXT_PUBLIC_TAWK_TO_ID is set)
    if (tawkId) {
      console.log("[SupportWidget] Loading Tawk.to with ID:", tawkId);
      if (!document.getElementById("tawk-script")) {
        const s1 = document.createElement("script");
        s1.id = "tawk-script";
        s1.async = true;
        // Allow three formats for NEXT_PUBLIC_TAWK_TO_ID:
        // 1) full URL (https://embed.tawk.to/xxx/yyy)
        // 2) two-part id (xxx/yyy)
        // 3) single id (xxx) — legacy case, append /default
        let src = "";
        if (tawkId.startsWith("http://") || tawkId.startsWith("https://")) {
          src = tawkId;
        } else if (tawkId.includes("/")) {
          src = `https://embed.tawk.to/${tawkId}`;
        } else {
          src = `https://embed.tawk.to/${tawkId}/default`;
        }
        s1.src = src;
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");
        document.body.appendChild(s1);
        console.log("[SupportWidget] Tawk.to script injected from:", src);
      }
    } else {
      console.log("[SupportWidget] NEXT_PUBLIC_TAWK_TO_ID not set");
    }

    // HubSpot chat snippet (only if NEXT_PUBLIC_HUBSPOT_ID is set)
    if (hubspotId) {
      if (!document.getElementById("hs-script-loader")) {
        const js = document.createElement("script");
        js.id = "hs-script-loader";
        js.src = `https://js.hs-scripts.com/${hubspotId}.js`;
        js.async = true;
        document.head.appendChild(js);
      }
    }
  }, []);

  return null;
}
