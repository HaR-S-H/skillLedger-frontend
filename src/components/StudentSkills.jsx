
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const skillCategories = [
  "Programming Languages",
  "Frameworks",
  "Design",
  "Data Analysis",
  "Blockchain",
  "Soft Skills",
  "Languages",
  "Other"
];

const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

const getLevelColor = (level) => {
  switch (level) {
    case "beginner":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "intermediate":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "advanced":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "expert":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    default:
      return "";
  }
};

const StudentSkills = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState([
    { id: "1", name: "React", category: "Frameworks", level: "advanced" },
    { id: "2", name: "TypeScript", category: "Programming Languages", level: "intermediate" },
    { id: "3", name: "Solidity", category: "Blockchain", level: "beginner" },
    { id: "4", name: "Figma", category: "Design", level: "intermediate" },
  ]);
  
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState(skillCategories[0]);
  const [newLevel, setNewLevel] = useState("beginner");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() === "") {
      toast({
        title: "Error",
        description: "Skill name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    const skill = {
      id: Date.now().toString(),
      name: newSkill.trim(),
      category: newCategory,
      level: newLevel
    };
    
    setSkills([...skills, skill]);
    setNewSkill("");
    setNewCategory(skillCategories[0]);
    setNewLevel("beginner");
    setIsAdding(false);
    
    toast({
      title: "Skill Added",
      description: `${skill.name} has been added to your skills.`
    });
  };

  const handleRemoveSkill = (id) => {
    const skillToRemove = skills.find(skill => skill.id === id);
    setSkills(skills.filter(skill => skill.id !== id));
    
    toast({
      title: "Skill Removed",
      description: `${skillToRemove?.name} has been removed from your skills.`
    });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>My Skills</span>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)}>Add Skill</Button>
            )}
          </CardTitle>
          <CardDescription>Manage your skills and expertise</CardDescription>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/40">
              <h3 className="text-base font-medium mb-4">Add a new skill</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Skill Name</label>
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="E.g. JavaScript"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Proficiency Level</label>
                  <Select 
                    value={newLevel} 
                    onValueChange={(value) => setNewLevel(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={handleAddSkill} className="flex-1">
                    <Check className="h-4 w-4 mr-1" /> Add
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {Object.entries(groupedSkills).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No skills added yet. Click "Add Skill" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <Badge 
                        key={skill.id} 
                        variant="outline"
                        className={`group py-2 px-3 ${getLevelColor(skill.level)}`}
                      >
                        {skill.name}
                        <span className="ml-2 text-xs opacity-70">{skillLevels.find(l => l.value === skill.level)?.label}</span>
                        <button 
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove skill"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSkills;
