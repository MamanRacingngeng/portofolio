import { getTranslations } from "next-intl/server";
import { MarqueeContent } from "./MarqueeContent";

export async function Marquee() {
  const t = await getTranslations("footer");

  return <MarqueeContent text={t("marquee")} />;
}
