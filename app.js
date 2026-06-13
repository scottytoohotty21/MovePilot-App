/*
  MovePilot Survey App
  Extracted from the original single-file HTML so the app logic can be reviewed
  and maintained separately from markup and styling. Inline HTML event handlers are
  intentionally preserved, so these function declarations remain in global scope.
*/



// -----------------------------------------------------------------------------
// Reference data and constants
// -----------------------------------------------------------------------------
const PROPERTY_TYPES = ["House", "Apartment", "Bungalow", "Office", "Shop"];
        const VEHICLE_TYPES = ["Shuttle van", "Transit van", "Luton / Low Loader", "7.5 tonne", "12 tonne", "15 tonne", "18 tonne", "20ft container", "40ft container"];
        const MOVE_TYPES = ["Dom-local", "Dom-Distance", "Dom-To Store", "Dom-Ex Store", "Euro Part Load", "Euro Direct", "GPG", "LCL", "FCL"];
        const OPERATING_BRANCHES = [
    "Aylesbury",
    "Crawley",
    "Edinburgh",
    "Ely",
    "Exeter",
    "Guildford",
    "London",
    "Solent",
    "York"
];
const BRANCH_DEPOTS = {
    Aylesbury: "Smeaton Cl, Aylesbury HP19 8UN",
    Crawley: "5 Kelvin Way, Crawley RH10 9SP",
    Edinburgh: "4 Eastfield Farm Rd, Penicuik EH26 8EZ",
    Ely: "Unit 40, Lancaster Way Business Park, ELY CB6 3NW",
    Exeter: "Windsor Court, Manaton Close, Matford Business Park, Exeter, Devon, EX2 8PF.",
    Guildford: "Slyfield Industrial Estate, Unit 4b, Opus Park, Moorfield Rd, Guildford GU1 1SZ",
    London: "",
    Solent: "Unit 8, Voyager Park, Portfield Rd, Portsmouth PO3 5GF",
    York: "Old Office Block Moor Lane Trading Estate, Sherburn in Elmet, Leeds LS25 6ES"
};
        const PACK_OPTIONS = ["Owner Pack", "Fragile (china & Glassware) pack", "Full Packing", "Full Export Pack and Wrap", "Unload Only"];
        const SALUTATIONS = ["Mr", "Miss", "Mrs", "Ms", "Other"];
        
        const DEFAULT_ROOMS = [
    "Lounge",
    "Dining Room",
    "Kitchen",
    "Utility Room",
    "Study",
    "Hallway",
    "Loft",
    "Main Bedroom",
    "Bedroom 2",
    "Bedroom 3",
    "Bedroom 4",
    "Bedroom 5",
    "Bathroom",
    "2nd Collection Address",
    "Dressing Room",
    "Garden",
    "Garage",
    "Shed",
    "Conservatory",
    "Landing",
    "Eaves Cupboards",
    "Understairs Cupboard",
    "Playroom",
    "Snug",
    "TV Room",
    "Office"
];
// --- APP SETTINGS / DISPLAY CONVERSIONS ---
const MOVEPILOT_APP_SETTINGS_KEY = "movepilot_app_settings_v1";
const CUFT_PER_CBM = 35.314;
const DEFAULT_VOLUMETRIC_KG_PER_CBM = 167;



// -----------------------------------------------------------------------------
// Unit conversion helpers
// -----------------------------------------------------------------------------
function cuftToCbm(cuft) {
    return Number(cuft || 0) / CUFT_PER_CBM;
}

function formatCbmFromCuft(cuft) {
    return cuftToCbm(cuft).toFixed(2);
}

function cuftToVolumetricKg(cuft, kgPerCbm) {
    const cbm = cuftToCbm(cuft);
    return cbm * Number(kgPerCbm || DEFAULT_VOLUMETRIC_KG_PER_CBM);
}

function formatVolumetricKgFromCuft(cuft, kgPerCbm) {
    return Math.round(cuftToVolumetricKg(cuft, kgPerCbm));
}
function formatVolumeDisplayFromCuft(cuft) {
    const settings = getAppSettings();
    const cleanCuft = Number(cuft || 0);
    const parts = [cleanCuft + " cuft"];

    if (settings.showCbm) {
