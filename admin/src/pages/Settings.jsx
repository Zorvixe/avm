import { useEffect, useState } from "react";
import { BadgeIndianRupee, Building2, KeyRound, Mail, MapPin, Phone, Save, Truck } from "lucide-react";
import "./Setting.css";

const API_URL=process.env.BACKEND_API_URL || "http://localhost:5000"

function Settings() {
  const token = localStorage.getItem("token");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [pickupLocations, setPickupLocations] = useState([]);
  const [settings, setSettings] = useState({
    company: "",
    email: "",
    phone: "+91 ",
    address: "",
    gst: "",
    razorpay_key_id: "",
    razorpay_key_secret: "",
    shiprocket_email: "",
    shiprocket_password: "",
    shiprocket_pickup_pincode: "",
    shiprocket_webhook_secret: "",
    shiprocket_default_pickup_id: "",
    shiprocket_default_pickup_name: "",
  });

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("Settings from API:", data);

        if (data.success) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(settings),
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.message || "Settings save failed");
      setMessage("Settings saved successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const testShiprocket = async () => {
    setTesting(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/settings/shiprocket-test`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          email: settings.shiprocket_email,
          password: settings.shiprocket_password,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.message || "Shiprocket test failed");
      setMessage("Shiprocket connection successful");
      await fetchPickupLocations();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setTesting(false);
    }
  };

  const fetchPickupLocations = async () => {
    try {
      const response = await fetch(`${API_URL}/shiprocket/pickup-locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const locations = data.pickup_locations || data.locations || data.data || [];
      setPickupLocations(Array.isArray(locations) ? locations : []);
      setMessage(Array.isArray(locations) ? `Found ${locations.length} pickup location(s)` : "No pickup locations found");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const selectPickup = (e) => {
    const id = e.target.value;
    const location = pickupLocations.find((item) => String(item.id || item.pickup_location_id) === String(id));
    setSettings({
      ...settings,
      shiprocket_default_pickup_id: id,
      shiprocket_default_pickup_name: location?.name || location?.pickup_location || "",
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <h1>Settings</h1>
        <p>Manage company, Razorpay and Shiprocket configuration.</p>

        {message && <div className="settings-message">{message}</div>}

        <form onSubmit={saveSettings}>
          <div className="settings-grid">
            <div className="setting-box">
              <label><Building2 size={18} /> Company Name</label>
              <input type="text" name="company" value={settings.company || ""} onChange={handleChange} />
            </div>

            <div className="setting-box">
              <label><Mail size={18} /> Email</label>
              <input type="email" name="email" value={settings.email || ""} onChange={handleChange} />
            </div>

            <div className="setting-box">
              <label><Phone size={18} /> Phone</label>
              <input type="text" name="phone" value={settings.phone || ""} onChange={handleChange} />
            </div>

            <div className="setting-box">
              <label><BadgeIndianRupee size={18} /> GST Number</label>
              <input type="text" name="gst" value={settings.gst || ""} onChange={handleChange} />
            </div>

            <div className="setting-box full">
              <label><MapPin size={18} /> Address</label>
              <textarea rows="3" name="address" value={settings.address || ""} onChange={handleChange} />
            </div>
          </div>

          <h2 className="settings-section-title">Razorpay</h2>
          <div className="settings-grid">
            <div className="setting-box">
              <label><KeyRound size={18} /> Key ID</label>
              <input type="text" name="razorpay_key_id" value={settings.razorpay_key_id || ""} onChange={handleChange} />
            </div>

            <div className="setting-box">
              <label><KeyRound size={18} /> Key Secret</label>
              <input type="password" name="razorpay_key_secret" value={settings.razorpay_key_secret || ""} onChange={handleChange} />
            </div>
          </div>

          <h2 className="settings-section-title">Shiprocket</h2>
          <div className="settings-grid">
            <div className="setting-box">
              <label><Mail size={18} /> Shiprocket Email</label>
              <input type="email" name="shiprocket_email" value={settings.shiprocket_email || ""} onChange={handleChange} />
            </div>

            <div className="setting-box">
              <label><KeyRound size={18} /> Shiprocket Password</label>
              <input type="password" name="shiprocket_password" value={settings.shiprocket_password || ""} onChange={handleChange} />
            </div>

            <div className="setting-box">
              <label><MapPin size={18} /> Pickup Pincode</label>
              <input type="text" name="shiprocket_pickup_pincode" value={settings.shiprocket_pickup_pincode || ""} onChange={handleChange} maxLength="6" />
            </div>

            <div className="setting-box">
              <label><KeyRound size={18} /> Webhook Secret</label>
              <input type="password" name="shiprocket_webhook_secret" value={settings.shiprocket_webhook_secret || ""} onChange={handleChange} />
            </div>

            <div className="setting-box full">
              <label><Truck size={18} /> Default Pickup Location</label>
              <select value={settings.shiprocket_default_pickup_id || ""} onChange={selectPickup}>
                <option value="">Select pickup location</option>
                {pickupLocations.map((location) => {
                  const locationId = location.id || location.pickup_location_id;
                  return (
                    <option key={locationId} value={locationId}>
                      {location.name || location.pickup_location || "Pickup"} - {location.city}, {location.state} ({location.pincode})
                    </option>
                  );
                })}
              </select>
              <button type="button" className="test-settings-btn" onClick={fetchPickupLocations}>
                Refresh Pickup Locations
              </button>
            </div>
          </div>

          <div className="settings-actions">
            <button type="button" className="test-settings-btn" onClick={testShiprocket} disabled={testing}>
              <Truck size={18} />
              {testing ? "Testing..." : "Test Shiprocket"}
            </button>

            <button type="submit" className="save-settings-btn" disabled={saving}>
              <Save size={18} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
