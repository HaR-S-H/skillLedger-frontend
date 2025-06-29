import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const CredentialCard = ({
  credential,
  onClick}) => {
  return (
    <Card 
      className="overflow-hidden border transition-all duration-300 hover:shadow-lg h-full flex flex-col cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <div className={`h-2 bg-gradient-to-r from-purple-500 to-pink-500`} />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          {/* <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
            {credential.icon}
          </div> */}
          
          <Badge variant="outline" className="bg-background">
            <Check className="h-3 w-3 mr-1" /> Verified
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">{credential.programId.skillName}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <span className="font-medium">{credential.organization.name}</span>
          <span className="mx-2">•</span>
           <span>{new Date(credential.createdAt).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})}</span>

        </div>
        {/* <div className="mt-auto">
          <Badge variant="secondary" className="text-xs">{credential.category}</Badge>
        </div> */}
      </CardContent>
      <CardFooter className="pt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto text-primary hover:text-primary/80"
          onClick={(e) => {
            e.stopPropagation();
            // Handle verify button click separately if needed
          }}
        >
          <ExternalLink className="h-4 w-4 mr-1" /> 
          Verify
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CredentialCard;
