import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Pencil,
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Tony Stark",
    email: "admin@terravita.com",
    phone: "+91 9876543210",
    location: "Hyderabad, India",
    role: "Administrator",
    image: "https://i.pravatar.cc/300?img=12",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfile({
        ...profile,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    console.log(profile);

    alert("Profile Updated Successfully!");

    setIsEditing(false);

    // Backend API Example
    /*
    fetch("http://localhost:5000/api/profile",{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(profile)
    })
    */
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* Left Side */}

        <div className="profile-left">

          <div className="profile-image">

            <img src={profile.image} alt="Profile" />

            {isEditing && (
              <>
                <label
                  htmlFor="profileImage"
                  className="camera-btn"
                >
                  <Camera size={18} />
                </label>

                <input
                  type="file"
                  id="profileImage"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                />
              </>
            )}

          </div>

          <h2>{profile.name}</h2>

          <span>{profile.role}</span>

        </div>

        {/* Right Side */}

        <div className="profile-right">

          <div className="profile-header">

            <h1>My Profile</h1>

            {!isEditing && (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={18} />
                Edit Profile
              </button>
            )}

          </div>

          <form onSubmit={handleSave}>

            <div className="profile-grid">

              {/* Full Name */}

              <div className="input-box">

                <label>
                  <User size={16} />
                  Full Name
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.name}</p>
                )}

              </div>

              {/* Email */}

              <div className="input-box">

                <label>
                  <Mail size={16} />
                  Email
                </label>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.email}</p>
                )}

              </div>

              {/* Phone */}

              <div className="input-box">

                <label>
                  <Phone size={16} />
                  Phone
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.phone}</p>
                )}

              </div>

              {/* Location */}

              <div className="input-box">

                <label>
                  <MapPin size={16} />
                  Location
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.location}</p>
                )}

              </div>

              {/* Role */}

              <div className="input-box full">

                <label>
                  <Briefcase size={16} />
                  Role
                </label>

                {isEditing ? (
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                  />
                ) : (
                  <p>{profile.role}</p>
                )}

              </div>

            </div>

            {isEditing && (
              <div className="profile-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save Changes
                </button>

              </div>
            )}

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;