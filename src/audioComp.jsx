import { useState } from "react";

export default function Audio({ src }) {
  return <audio src={src} autoPlay preload="auto"></audio>;
}
