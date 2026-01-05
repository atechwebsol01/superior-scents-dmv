import React from 'react';
import { User, Building, Bell, Lock, CreditCard, Palette, Save } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useThemeStore } from '@/store/themeStore';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <PageContainer
      title="Settings"
      subtitle="Manage your account and preferences"
      breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Settings' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardBody className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardBody>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Profile Information</h3>
                <p className="text-sm text-neutral-500">Update your personal details</p>
              </div>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" defaultValue="Admin" />
                  <Input label="Last Name" defaultValue="User" />
                  <Input label="Email" type="email" defaultValue="admin@superiorscents.com" />
                  <Input label="Phone" defaultValue="(202) 555-0100" />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="primary" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card>
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Company Settings</h3>
                <p className="text-sm text-neutral-500">Manage your business information</p>
              </div>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input label="Company Name" defaultValue="Superior Scents DMV, LLC" />
                  </div>
                  <Input label="Business Email" defaultValue="info@superiorscents.com" />
                  <Input label="Business Phone" defaultValue="(202) 555-0100" />
                  <div className="md:col-span-2">
                    <Input label="Address" defaultValue="123 Scent Avenue, Washington, DC 20001" />
                  </div>
                  <Input label="Tax ID" defaultValue="XX-XXXXXXX" />
                  <Input label="Default Tax Rate (%)" type="number" defaultValue="6" />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="primary" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Notification Preferences</h3>
                <p className="text-sm text-neutral-500">Configure how you receive notifications</p>
              </div>
              <CardBody>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Receive updates via email', default: true },
                    { label: 'New Invoice Alerts', desc: 'Get notified when invoices are created', default: true },
                    { label: 'Payment Received', desc: 'Alerts when payments are processed', default: true },
                    { label: 'Overdue Reminders', desc: 'Reminders for overdue invoices', default: true },
                    { label: 'Weekly Reports', desc: 'Receive weekly summary reports', default: false },
                    { label: 'Marketing Updates', desc: 'News and promotional content', default: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{item.label}</p>
                        <p className="text-sm text-neutral-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Security Settings</h3>
                <p className="text-sm text-neutral-500">Manage your account security</p>
              </div>
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-white mb-4">Change Password</h4>
                    <div className="space-y-4 max-w-md">
                      <Input label="Current Password" type="password" />
                      <Input label="New Password" type="password" />
                      <Input label="Confirm New Password" type="password" />
                    </div>
                    <Button variant="primary" className="mt-4" onClick={handleSave}>Update Password</Button>
                  </div>
                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-medium text-neutral-900 dark:text-white mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-neutral-500 mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Billing & Subscription</h3>
                <p className="text-sm text-neutral-500">Manage your subscription and payment methods</p>
              </div>
              <CardBody>
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-6">
                  <p className="text-sm opacity-90 mb-1">Current Plan</p>
                  <p className="text-2xl font-bold mb-2">Professional Plan</p>
                  <p className="text-sm opacity-90">$49/month • Renews March 1, 2024</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">Payment Method</p>
                      <p className="text-sm text-neutral-500">Visa ending in 4242</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">Billing History</p>
                      <p className="text-sm text-neutral-500">View past invoices and receipts</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-white">Appearance</h3>
                <p className="text-sm text-neutral-500">Customize how the app looks</p>
              </div>
              <CardBody>
                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white mb-4">Theme</p>
                    <div className="flex gap-4">
                      {[
                        { value: 'light', label: 'Light', icon: '☀️' },
                        { value: 'dark', label: 'Dark', icon: '🌙' },
                        { value: 'system', label: 'System', icon: '💻' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setTheme(opt.value as typeof theme)}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                            theme === opt.value
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{opt.icon}</span>
                          <span className="font-medium text-neutral-900 dark:text-white">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="font-medium text-neutral-900 dark:text-white mb-2">Brand Colors</p>
                    <p className="text-sm text-neutral-500 mb-4">Primary: Purple (#8B5CF6) • Secondary: Green (#10B981)</p>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-primary-500 shadow-lg" />
                      <div className="w-16 h-16 rounded-xl bg-secondary-500 shadow-lg" />
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg" />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
