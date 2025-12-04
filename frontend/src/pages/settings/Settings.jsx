import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Bell, Shield, Moon, Globe, Database, MessageSquare, Mail, Smartphone } from 'lucide-react'

const Settings = () => {
  const { user } = useAuth()
  const { mode, setTheme, isDark, isLight, isAuto } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    appointmentReminders: true,
    healthAlerts: true,
    newsletter: false,
  })

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showAppointments: false,
    showMedicalInfo: false,
    dataSharing: false,
    anonymizedData: true,
  })

  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('UTC')

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    toast.success('Notification settings updated')
  }

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    toast.success('Privacy settings updated')
  }

  const handleSaveSettings = () => {
    // In a real app, you would save these to the backend
    toast.success('Settings saved successfully')
  }

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setNotifications({
        email: true,
        push: true,
        sms: false,
        appointmentReminders: true,
        healthAlerts: true,
        newsletter: false,
      })
      setPrivacy({
        showProfile: true,
        showAppointments: false,
        showMedicalInfo: false,
        dataSharing: false,
        anonymizedData: true,
      })
      setLanguage('en')
      setTimezone('UTC')
      toast.success('Settings reset to default')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your CareSync experience and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Customize your app preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <Select value={mode} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred language
                    </p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Timezone</Label>
                    <p className="text-sm text-muted-foreground">
                      Set your local timezone
                    </p>
                  </div>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">EST (New York)</SelectItem>
                      <SelectItem value="CST">CST (Chicago)</SelectItem>
                      <SelectItem value="PST">PST (Los Angeles)</SelectItem>
                      <SelectItem value="GMT">GMT (London)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Notification Channels</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={() => handleNotificationChange('email')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={() => handleNotificationChange('push')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={() => handleNotificationChange('sms')}
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="font-semibold">Notification Types</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders for upcoming appointments
                      </p>
                    </div>
                    <Switch
                      id="appointment-reminders"
                      checked={notifications.appointmentReminders}
                      onCheckedChange={() => handleNotificationChange('appointmentReminders')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="health-alerts">Health Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Important health updates and alerts
                      </p>
                    </div>
                    <Switch
                      id="health-alerts"
                      checked={notifications.healthAlerts}
                      onCheckedChange={() => handleNotificationChange('healthAlerts')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive health tips and updates
                      </p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={notifications.newsletter}
                      onCheckedChange={() => handleNotificationChange('newsletter')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your privacy and data sharing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Profile Visibility</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-profile">Show Profile to Doctors</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow doctors to view your basic profile information
                      </p>
                    </div>
                    <Switch
                      id="show-profile"
                      checked={privacy.showProfile}
                      onCheckedChange={() => handlePrivacyChange('showProfile')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-appointments">Show Appointment History</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow doctors to view your appointment history
                      </p>
                    </div>
                    <Switch
                      id="show-appointments"
                      checked={privacy.showAppointments}
                      onCheckedChange={() => handlePrivacyChange('showAppointments')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-medical-info">Share Medical Information</Label>
                      <p className="text-sm text-muted-foreground">
                        Share medical information with treating doctors
                      </p>
                    </div>
                    <Switch
                      id="show-medical-info"
                      checked={privacy.showMedicalInfo}
                      onCheckedChange={() => handlePrivacyChange('showMedicalInfo')}
                    />
                  </div>
                </div>

                <Separator />

                <h3 className="font-semibold">Data Usage</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-sharing">Data Sharing for Research</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymized data to be used for medical research
                      </p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={privacy.dataSharing}
                      onCheckedChange={() => handlePrivacyChange('dataSharing')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anonymized-data">Anonymized Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Share anonymized usage data to improve the platform
                      </p>
                    </div>
                    <Switch
                      id="anonymized-data"
                      checked={privacy.anonymizedData}
                      onCheckedChange={() => handlePrivacyChange('anonymizedData')}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Data Management</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Download Your Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      Request Data Deletion
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      You have the right to access and delete your personal data
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Advanced configuration and debugging options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Cache & Storage</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Clear Cache
                    </Button>
                    <Button variant="outline" className="w-full">
                      Clear Local Storage
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Clearing cache may improve performance but will remove offline data
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">API & Debugging</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      View API Status
                    </Button>
                    <Button variant="outline" className="w-full">
                      Generate Debug Report
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Useful for troubleshooting and support requests
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Experimental Features</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="beta-features">Beta Features</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable experimental features (may be unstable)
                        </p>
                      </div>
                      <Switch id="beta-features" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ai-assistant">Enhanced AI Assistant</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable advanced AI features (requires more data)
                        </p>
                      </div>
                      <Switch id="ai-assistant" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Button variant="outline" onClick={handleResetSettings}>
          Reset to Default
        </Button>
        <Button onClick={handleSaveSettings}>
          Save All Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings