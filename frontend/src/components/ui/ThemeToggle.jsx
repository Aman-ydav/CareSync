import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Monitor, Check } from 'lucide-react';

const ThemeToggle = () => {
  const { mode, setTheme, isLight, isDark, isAuto } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {isAuto ? <Monitor className="w-4 h-4" /> : isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <span>Light</span>
          </div>
          {isLight && !isAuto && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4" />
            <span>Dark</span>
          </div>
          {isDark && !isAuto && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setTheme('auto')} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span>System</span>
          </div>
          {isAuto && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;