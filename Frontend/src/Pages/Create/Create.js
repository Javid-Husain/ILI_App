import React from 'react';

export default function Create() {
    return (

        <div className="container mx-auto p-4 w-4/5">
            <h1 className="text-2xl font-bold mb-5">Fill the form</h1>
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" className="px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <div className="relative">
                            <input type="date" className="px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm pr-10" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                    <i className="fas fa-calendar-alt"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <div className="mt-2">
                            <label className="inline-flex items-center mr-6">
                                <input type="radio" name="gender" className="form-radio" />
                                <span className="ml-2">Male</span>
                            </label>
                            <label className="inline-flex items-center mr-6">
                                <input type="radio" name="gender" className="form-radio" />
                                <span className="ml-2">Female</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="gender" className="form-radio" />
                                <span className="ml-2">Other</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            <option>Choose</option>
                            <option>General</option>
                            <option>OBC</option>
                            <option>SC</option>
                            <option>ST</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Class</label>
                        <input type="text" className="px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input type="text" className="px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input type="text" className="px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </form>
            </div>

            {/* Disability Details */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Disability Details</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Disability Type</label>
                        <div className="mt-2">
                            <label className="inline-flex items-center mr-4">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2">Blindness</span>
                            </label>
                            <label className="inline-flex items-center mr-4">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2">Low Vision</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="checkbox" className="form-checkbox" />
                                <span className="ml-2">Hearing Impairment</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Disability by Birth?</label>
                        <div className="mt-2">
                            <label className="inline-flex items-center mr-6">
                                <input type="radio" name="disabilityByBirth" className="form-radio" />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="disabilityByBirth" className="form-radio" />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Disability Since</label>
                        <div className="relative">
                            <input type="date" className="px-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm pr-10" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                    <i className="fas fa-calendar-alt"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Disability Area</label>
                        <div className="mt-2">
                            <label className="inline-flex items-center mr-6">
                                <input type="radio" name="disabilityArea" className="form-radio" />
                                <span className="ml-2">Left Eye</span>
                            </label>
                            <label className="inline-flex items-center mr-6">
                                <input type="radio" name="disabilityArea" className="form-radio" />
                                <span className="ml-2">Right Eye</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="disabilityArea" className="form-radio" />
                                <span className="ml-2">Both</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Disability Due to</label>
                        <div className="mt-2">
                            <label className="inline-flex items-center mr-6">
                                <input type="radio" name="disabilityDueTo" className="form-radio" />
                                <span className="ml-2">Accident</span>
                            </label>
                            <label className="inline-flex items-center mr-6">
                                <input type="radio" name="disabilityDueTo" className="form-radio" />
                                <span className="ml-2">Congenital</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input type="radio" name="disabilityDueTo" className="form-radio" />
                                <span className="ml-2">Hereditary</span>
                            </label>
                        </div>
                    </div>

{/* Father's Occupation */}
<div>
    <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
    <div className="mt-2">
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Govt Job</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Professional/Technician</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Agriculture</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Services & Shops</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Clerks Craft/Trade Worker</span>
        </label>
        <label className="inline-flex items-center">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Other Occupation</span>
        </label>
    </div>
</div>

{/* Mother's Occupation */}
<div>
    <label className="block text-sm font-medium text-gray-700">Mother's Occupation</label>
    <div className="mt-2">
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Govt Job</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Professional/Technician</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Agriculture</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Services & Shops</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Clerks Craft/Trade Worker</span>
        </label>
        <label className="inline-flex items-center">
            <input type="radio" name="fathersOccupation" className="form-radio" />
            <span className="ml-2">Other Occupation</span>
        </label>
    </div>
</div>

{/* Family Annual Income */}
<div>
    <label className="block text-sm font-medium text-gray-700">Family Annual Income</label>
    <div className="mt-2">
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="familyIncome" className="form-radio" />
            <span className="ml-2">Below 10,000</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="familyIncome" className="form-radio" />
            <span className="ml-2">From 10,000 to 1,00,000</span>
        </label>
        <label className="inline-flex items-center mr-6">
            <input type="radio" name="familyIncome" className="form-radio" />
            <span className="ml-2">1,00,000 to 5,00,000</span>
        </label>
        <label className="inline-flex items-center">
            <input type="radio" name="familyIncome" className="form-radio" />
            <span className="ml-2">More than 5,00,000</span>
        </label>
    </div>
</div>

<div className="flex gap-8">
    <button 
        type="button" 
        onClick={() => window.location.href='/'}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
    >
        Back
    </button>
    <button 
        type="submit" 
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
        Submit
    </button>
</div>

                </form>
            </div>
        </div>
    );
}
