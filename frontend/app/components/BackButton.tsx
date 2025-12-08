
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function BackButton() {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.back()} >
      <span>Back</span>
    </Button>
  );
}