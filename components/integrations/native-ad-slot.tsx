import { adsterraSlotHtml } from "@/lib/adsterra-slots";

export function NativeAdSlot() {
  return <div dangerouslySetInnerHTML={{ __html: adsterraSlotHtml("native") }} />;
}
