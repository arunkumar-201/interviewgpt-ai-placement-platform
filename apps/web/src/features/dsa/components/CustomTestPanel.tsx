import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomTestPanelProps {
  customInput: string;
  customExpected: string;
  onInputChange: (v: string) => void;
  onExpectedChange: (v: string) => void;
}

export function CustomTestPanel({
  customInput,
  customExpected,
  onInputChange,
  onExpectedChange,
}: CustomTestPanelProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Custom test case</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="custom-input" className="text-xs">
            Input (JSON)
          </Label>
          <Input
            id="custom-input"
            className="mt-1 font-mono text-xs"
            placeholder='{"nums":[1,2],"target":3}'
            value={customInput}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="custom-expected" className="text-xs">
            Expected output (optional)
          </Label>
          <Input
            id="custom-expected"
            className="mt-1 font-mono text-xs"
            placeholder="[0,1]"
            value={customExpected}
            onChange={(e) => onExpectedChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
