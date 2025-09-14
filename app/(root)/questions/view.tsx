"use client";

import { toast } from "@/hooks/use-toast";
import { incrementViews } from "@/lib/actions/question.action";
import { useEffect } from "react";

const View = ({ questionId }: { questionId: string }) => {
  const handleIncrementViews = async () => {
    const result = await incrementViews({ questionId });

    if (result.success) {
      toast({
        title: "View count incremented",
        description: "View incremented",
      });
    } else {
      toast({
        title: "Error",
        description: result.error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    handleIncrementViews();
  }, []);

  return null;
};

export default View;
