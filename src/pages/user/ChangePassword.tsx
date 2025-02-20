
// src/pages/ChangePassword.tsx


export const ChangePassword = () => {
  return (
    <>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Current Password</label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">New Password</label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
        >
          Update Password
        </button>
      </form>
    </>
  );
};