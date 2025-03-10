import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Lead } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lead } = useQuery<Lead>({
    queryKey: ["/api/leads", id],
  });

  if (!lead) return null;

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/leads")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Leads
      </Button>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{lead.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <p>{lead.company}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Info</h3>
              <p>{lead.contactInfo}</p>
            </div>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{lead.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Last Activity</h3>
              <p>{new Date(lead.lastActivity).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
