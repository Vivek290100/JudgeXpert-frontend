
// src/pages/EditProfile.tsx

export const EditProfile = () => {
  return (
    <>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">GitHub URL</label>
          <input
            type="url"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">LinkedIn URL</label>
          <input
            type="url"
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
        >
          Save Changes
        </button>
      </form>
    </>
  );
};