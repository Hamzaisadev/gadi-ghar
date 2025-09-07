import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Copy, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ShareDialog = ({ open, onOpenChange, carToShare, onShare }) => {
  const [isCopying, setIsCopying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  if (!carToShare) return null;

  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/cars/${carToShare.id}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Share {carToShare.make} {carToShare.model}
          </DialogTitle>
          <DialogDescription>
            Share this car listing with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-1.5">
              <Input
                id="share-link"
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Anyone with this link can view this car listing
              </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="shrink-0"
              disabled={isCopying}
              onClick={async () => {
                if (isCopying) return;
                setIsCopying(true);
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied to clipboard!");
                } catch (err) {
                  console.error("Failed to copy:", err);
                  toast.error("Failed to copy link. Please try again.");
                } finally {
                  setIsCopying(false);
                }
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">{isCopying ? "Copying..." : "Copy link"}</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onShare(carToShare)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share via...
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                window.open(
                  `https://wa.me/?text=Check out this ${encodeURIComponent(
                    carToShare.make + " " + carToShare.model
                  )} on GadiGhar: ${shareUrl}`,
                  "_blank"
                );
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
