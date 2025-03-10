import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { InsertBid, insertBidSchema } from "@shared/schema";

const BID_STATUSES = ["Pending", "Accepted", "Rejected"] as const;

export default function BidForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<InsertBid>({
    resolver: zodResolver(insertBidSchema),
    defaultValues: {
      jobTitle: "",
      jobLink: "",
      bidAmount: 0,
      status: "Pending",
      submissionDate: new Date(),
      addedById: 1, // Default user ID, update this when auth is implemented
      proposalNotes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertBid) => {
      try {
        console.log('Submitting bid data:', data);
        const formattedData = {
          ...data,
          submissionDate: data.submissionDate instanceof Date 
            ? data.submissionDate.toISOString() 
            : data.submissionDate ? new Date(data.submissionDate).toISOString() : new Date().toISOString(),
          bidAmount: Number(data.bidAmount),
          addedById: Number(data.addedById),
        };
        console.log('Formatted data:', formattedData);

        const response = await apiRequest("POST", "/api/bids", formattedData);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create bid");
        }
        const result = await response.json();
        console.log('Created bid:', result);
        return result;
      } catch (error) {
        console.error("Error creating bid:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Bid created successfully, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["/api/bids"] });
      toast({
        title: "Success",
        description: "Bid created successfully",
      });
      navigate("/bids");
    },
    onError: (error: Error) => {
      console.error("Create bid error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create bid",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertBid) => {
    console.log("Form submitted with data:", data);
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Bid</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter job title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Link <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter job URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bidAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bid Amount <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="Enter bid amount" 
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BID_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="submissionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submission Date <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proposalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposal Notes <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} placeholder="Enter proposal notes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Bid"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/bids")}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}