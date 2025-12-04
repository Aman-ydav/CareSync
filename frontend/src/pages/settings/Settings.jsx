import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Bell, Shield, Globe,
  Mail, Smartphone, Database
} from "lucide-react";

export default function SettingsPage() {
  const { mode, setTheme } = useTheme();

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    appointmentReminders: true,
    healthAlerts: true,
    newsletter: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showAppointments: false,
    showMedicalInfo: false,
    dataSharing: false,
    anonymizedData: true,
  });

  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

  const handleSave = () => {
    toast.success("Settings saved");
  };

  const handleReset = () => {
    setNotifications({
      email: true,
      push: true,
      sms: false,
      appointmentReminders: true,
      healthAlerts: true,
      newsletter: false,
    });
    setPrivacy({
      showProfile: true,
      showAppointments: false,
      showMedicalInfo: false,
      dataSharing: false,
      anonymizedData: true,
    });
    setLanguage("en");
    setTimezone("UTC");
    toast.success("Settings reset");
  };

  return (
    <div className="mt-16 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="text-xs text-muted-foreground">
          Customize your CareSync experience.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">

        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5"/>
                General Settings
              </CardTitle>
              <CardDescription>
                Customize language, theme, timezone
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-xs text-muted-foreground">Choose theme</p>
                </div>
                <Select value={mode} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator/>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Language</Label>
                  <p className="text-xs text-muted-foreground">Preferred language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator/>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Timezone</Label>
                  <p className="text-xs text-muted-foreground">Local timezone</p>
                </div>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="IST">IST (India)</SelectItem>
                    <SelectItem value="EST">EST (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5"/>
                Notifications
              </CardTitle>
              <CardDescription>Choose how you get updates</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              <div className="flex items-center justify-between">
                <Label>Email</Label>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={() => setNotifications(p => ({...p, email: !p.email}))}
                />
              </div>

              <Separator/>

              <div className="flex items-center justify-between">
                <Label>Push</Label>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={() => setNotifications(p => ({...p, push: !p.push}))}
                />
              </div>

              <Separator/>

              <div className="flex items-center justify-between">
                <Label>SMS</Label>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={() => setNotifications(p => ({...p, sms: !p.sms}))}
                />
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5"/>
                Privacy
              </CardTitle>
              <CardDescription>Manage visibility and data usage</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              <div className="flex items-center justify-between">
                <Label>Show Profile To Doctors</Label>
                <Switch
                  checked={privacy.showProfile}
                  onCheckedChange={() => setPrivacy(p => ({...p, showProfile: !p.showProfile}))}
                />
              </div>

              <Separator/>

              <div className="flex items-center justify-between">
                <Label>Show Appointments</Label>
                <Switch
                  checked={privacy.showAppointments}
                  onCheckedChange={() => setPrivacy(p => ({...p, showAppointments: !p.showAppointments}))}
                />
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5"/>
                Advanced
              </CardTitle>
              <CardDescription>Tools & debug</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Button variant="outline" className="w-full">Clear Cache</Button>
              <Button variant="outline" className="w-full">Clear Local Storage</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>

    </div>
  );
}
