import { SVGProps } from "react";
import { Timestamp } from "firebase/firestore";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export * from "./firestore";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}
