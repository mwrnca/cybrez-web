import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import api from "@/lib/axios";
import ENDPOINTS from "@/api/endpoints";
import { useAuth } from "@/contexts/useAuth";

interface UserUpdateRequest {
  full_name?: string;
}

interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

async function updateProfile(data: UserUpdateRequest) {
  const response = await api.patch(
    ENDPOINTS.users.me,
    data
  );

  return response.data;
}

async function changePassword(
  data: PasswordChangeRequest
) {
  const response = await api.patch(
    `${ENDPOINTS.users.me}/password`,
    data
  );

  return response.data;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(
    user?.full_name ?? ""
  );

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [profileMessage, setProfileMessage] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await refreshUser();
      setProfileMessage("Profile updated successfully.");
    },
    onError: (error) => {
      setProfileMessage(String(error));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage(
        "Password updated successfully."
      );
    },
    onError: (error) => {
      setPasswordMessage(String(error));
    },
  });

  function handleProfileSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setProfileMessage("");

    profileMutation.mutate({
      full_name: fullName,
    });
  }

  function handlePasswordSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordMessage("");

    passwordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  return (
    <div className="cybrez-page">
      <div className="cybrez-organizations-page">
        <header className="cybrez-page-header">
          <div>
            <span className="cybrez-badge">
              Account
            </span>

            <h1>Profile</h1>

            <p>
              Manage your personal information and account
              credentials.
            </p>
          </div>
        </header>

        <section
          className="cybrez-card"
          style={{ marginBottom: "1.5rem" }}
        >
          <div className="cybrez-section-header">
            <div>
              <h2>Personal information</h2>
            </div>
          </div>

          <form
            onSubmit={handleProfileSubmit}
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <label>
              <span>Full name</span>
              <input
                className="cybrez-input"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                className="cybrez-input"
                value={user?.email ?? ""}
                disabled
              />
            </label>

            <button
              type="submit"
              className="cybrez-button cybrez-button-primary"
              disabled={profileMutation.isPending}
            >
              {profileMutation.isPending
                ? "Saving..."
                : "Save profile"}
            </button>

            {profileMessage && (
              <p>{profileMessage}</p>
            )}
          </form>
        </section>

        <section className="cybrez-card">
          <div className="cybrez-section-header">
            <div>
              <h2>Change password</h2>
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <label>
              <span>Current password</span>
              <input
                className="cybrez-input"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                required
              />
            </label>

            <label>
              <span>New password</span>
              <input
                className="cybrez-input"
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                minLength={8}
                required
              />
            </label>

            <button
              type="submit"
              className="cybrez-button cybrez-button-primary"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending
                ? "Updating..."
                : "Change password"}
            </button>

            {passwordMessage && (
              <p>{passwordMessage}</p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}