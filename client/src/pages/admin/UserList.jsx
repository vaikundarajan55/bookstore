import { useMemo, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers,addNewUser,EditNewUser,deleteUser } from "../../Redux/slices/alluserSlice"

// ── Animated Modal Shell ────────────────────────────────────────────────────
function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-auto border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Master Enhanced Dialog (Confirm / Success / Danger) ─────────────────────
function ConfirmDialog({ 
  open, 
  type = "info", // "info" | "success" | "danger" | "warning"
  title, 
  message, 
  confirmLabel = "Confirm", 
  cancelLabel = "Cancel",
  onConfirm, 
  onCancel,
  changes = [],  // array of { field, from, to } for Edit confirmations
  userPreview = null // object containing user details { name, email, role, status, image } for success layouts
}) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="p-6">
        
        {/* Header Icon Layout by Type */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            type === "danger" ? "bg-rose-50 text-rose-500" :
            type === "success" ? "bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/50" :
            type === "warning" ? "bg-amber-50 text-amber-500" :
            "bg-indigo-50 text-indigo-500"
          }`}>
            {type === "danger" && (
              <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {type === "success" && (
              <motion.svg 
                className="w-6 h-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ scale: 0.6, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
            {type === "warning" && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            )}
            {type === "info" && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{message}</p>
          </div>
        </div>

        {/* Dynamic Section 1: Changed Fields Summary (Useful for Edit Confirmation) */}
        {changes.length > 0 && (
          <div className="mt-4 mb-5 border border-gray-150 rounded-xl overflow-hidden bg-gray-50/50">
            <div className="bg-gray-100/70 px-4 py-2 text-xs font-bold text-gray-500 border-b border-gray-150 uppercase tracking-wider">
              Modified Settings ({changes.length})
            </div>
            <div className="divide-y divide-gray-150 max-h-48 overflow-y-auto">
              {changes.map((c, i) => (
                <div key={i} className="px-4 py-2.5 text-xs grid grid-cols-3 gap-2 items-center">
                  <span className="font-semibold text-gray-500 capitalize">{c.field}</span>
                  <span className="text-rose-600 line-through truncate bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">{c.from || "empty"}</span>
                  <span className="text-emerald-700 font-medium truncate bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <span className="text-emerald-500 font-semibold">→</span> {c.to || "empty"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Section 2: Success Visual User Preview Card */}
        {type === "success" && userPreview && (
          <motion.div 
            className="mt-4 mb-5 p-4 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/20 to-teal-50/10 shadow-inner flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <UserAvatar name={userPreview.name} image={userPreview.image} className="w-14 h-14" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-800 truncate">{userPreview.name}</h4>
              <p className="text-xs text-gray-500 truncate mt-0.5">{userPreview.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wide">
                  {userPreview.role}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  userPreview.status === "Active" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                  {userPreview.status}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions bar */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-250 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-xl text-white shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0 ${
              type === "danger" ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200" :
              type === "success" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" :
              type === "warning" ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200" :
              "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
            }`}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </Modal>
  )
}

// ── Toast Notification ──────────────────────────────────────────────────────
function Toast({ message, type = "success", visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-[100]"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}>
            {type === "success" ? (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Animated File Upload Zone ────────────────────────────────────────────────
function FileUploadZone({ initialValue, onChange }) {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(initialValue ? 100 : 0)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(initialValue || "")
  const fileInputRef = useRef(null)

  const processFile = (file) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.")
      return
    }

    setUploading(true)
    setProgress(0)

    const reader = new FileReader()
    reader.onload = (e) => {
      const resultUrl = e.target.result
      
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 10
        if (currentProgress >= 100) {
          currentProgress = 100
          clearInterval(interval)
          setProgress(100)
          setUploading(false)
          setPreviewUrl(resultUrl)
          // ✅ Pass both base64 url and original file
          onChange({ url: resultUrl, file: file })
        } else {
          setProgress(currentProgress)
        }
      }, 100)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); 
  const file = e.dataTransfer.files?.[0]; processFile(file) }
  const handleFileChange = (e) => { const file = e.target.files?.[0]; processFile(file) }
  const triggerSelect = () => fileInputRef.current?.click()
  const removeImage = (e) => { e.stopPropagation(); setPreviewUrl(""); setProgress(0); onChange({ url: "", file: null }); 
  if (fileInputRef.current) fileInputRef.current.value = "" }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">User Image / Avatar</label>
      
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerSelect}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[140px] ${
          isDragging 
            ? "border-indigo-500 bg-indigo-50/50" 
            : previewUrl 
              ? "border-gray-200 bg-gray-50/20" 
              : "border-gray-300 hover:border-indigo-400 bg-white"
        }`}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

        {uploading ? (
          <div className="w-full space-y-3 px-4">
            <div className="flex justify-between items-center text-xs font-semibold text-indigo-600">
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing image...
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-indigo-600 h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        ) : previewUrl ? (
          <div className="flex items-center gap-4 w-full">
            <div className="relative group w-20 h-20 rounded-xl overflow-hidden shadow-md border border-gray-100 flex-shrink-0">
              <img src={previewUrl} alt="Uploaded avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transform scale-90 group-hover:scale-100 transition duration-250"
                  title="Remove Image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-800">Image uploaded successfully</p>
              <p className="text-xs text-gray-400">Click or drag a new photo here to replace it.</p>
              <button 
                type="button" 
                onClick={removeImage}
                className="mt-1 text-xs text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1"
              >
                Delete current image
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2 pointer-events-none">
            <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                <span className="text-indigo-600">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, SVG or WEBP up to 5MB</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ── Default Visual Avatar Renderer ───────────────────────────────────────────
function UserAvatar({ name, image, className = "w-10 h-10" }) {
  if (image) {
    return <img src={image} alt={name} className={`${className} rounded-full object-cover border border-gray-150 shadow-sm`} />
  }
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
  const bgColors = ["bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-purple-500", "bg-sky-500"]
  const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const chosenBg = bgColors[charCodeSum % bgColors.length]

  return (
    <div className={`${className} rounded-full flex items-center justify-center text-white text-xs font-bold ${chosenBg} shadow-sm uppercase`}>
      {initials}
    </div>
  )
}

// ── Main App Component ───────────────────────────────────────────────────────
export default function UserList() {
  const dispatch = useDispatch();

  const [addOpenModel, setAddOpenModel] = useState(false)
  const allUsers = useSelector((state) => state.alluser?.allusers ?? []);

  useEffect(() => {
       dispatch(getAllUsers());

  }, [dispatch])

  const [users, setUsers] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "Viewer",
      image: ""
  });

  // ── Form State Blueprints ──
  const initialFormState = {
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "Viewer",
    status: "Active",
    image: "",
    imageFile: null
  }

  // ── Modal & Flow Control States ──
  
  const [editOpen, setEditOpen]     = useState(false)
  const [addForm, setAddForm]       = useState(initialFormState)
  const [editForm, setEditForm]     = useState(initialFormState)
  const [editingId, setEditingId]   = useState(null)
  const [errors, setErrors] = useState({});

  // ── Flow Dialog Specific States ──
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: "info", // "info" | "success" | "danger"
    title: "",
    message: "",
    confirmLabel: "Confirm",
    onConfirm: null,
    onCancel: null,
    changes: [],
    userPreview: null
  })

  // ── Toast state ──
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" })

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000)
  }

  // ── Table filtering / sorting / pagination state ──
  const [search, setSearch]           = useState("")
  const [pageSize, setPageSize]       = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return allUsers
    return allUsers.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term) ||
      u.status.toLowerCase().includes(term)
    )
  }, [allUsers, search])

  const totalCount = filteredUsers.length

  const totalPages = useMemo(() => {
    if (pageSize === 0) return 1
    return Math.max(1, Math.ceil(totalCount / pageSize))
  }, [totalCount, pageSize])

  const paginatedUsers = useMemo(() => {
    if (pageSize === 0) return filteredUsers
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  const handleSearchChange    = (e) => { setSearch(e.target.value); setCurrentPage(1) }
  const handlePageSizeChange  = (e) => { setPageSize(e.target.value === "all" ? 0 : Number(e.target.value)); setCurrentPage(1) }
  const goToPage              = (p) => { if (p >= 1 && p <= totalPages) setCurrentPage(p) }

  // ── FLOW: ADD USER ────────────────────────────────────────────────────────
  const addnewUser = () => { 
    setAddForm(initialFormState)
    setAddOpenModel(true) 
  }

  // Phase 1: Ask user confirmation to add the profile
  const initiateAddConfirm = () => {
    const newErrors = {};
      if (!addForm.name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!addForm.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!addForm.mobile.trim()) {
      newErrors.mobile = "Mobile Number is required";
    }

    if (!addForm.password) {
      newErrors.password = "Password is required";
    }

    if (!addForm.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    }

    if (
      addForm.password &&
      addForm.confirmPassword &&
      addForm.password !== addForm.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    setConfirmState({
      open: true,
      type: "info",
      title: "Add New User Account?",
      message: `Are you sure you want to register ${addForm.name} as a new system ${addForm.role}?`,
      confirmLabel: "Yes, Register User",
      onCancel: () => setConfirmState(p => ({ ...p, open: false })),
      onConfirm: executeAddSave
    })
  }

  // Phase 2: Save addition and display success card modal 
  const executeAddSave = () => {
    const formData = new FormData();
    formData.append("name", addForm.name);
    formData.append("email", addForm.email);
    formData.append("mobile", addForm.mobile);
    formData.append("role", addForm.role);
    formData.append("status", addForm.status);
    formData.append("password", addForm.password);

    // ✅ Append actual file, not base64 string
    if (addForm.imageFile) {
        formData.append("image", addForm.imageFile); 
    }

    const response = dispatch(addNewUser(formData));
    
    //setUsers(prev => [newUser, ...prev])
    setAddOpenModel(false) // Hide form input sheet
    
    // Trigger Success Summary modal
    setConfirmState({
      open: true,
      type: "success",
      title: "User Registered Successfully!",
      message: `${addForm.name} has been successfully added with the parameters listed below.`,
      confirmLabel: "Done & Continue",
      onConfirm: () => setConfirmState(p => ({ ...p, open: false })),
      onCancel: null, // Don't show cancel on completion
      userPreview: addForm
    })
    showToast(`${addForm.name} created!`)
  }

  // ── FLOW: EDIT USER ───────────────────────────────────────────────────────
 const openEdit = (user) => { 
    setEditForm({ 
      name:            user.name, 
      email:           user.email, 
      mobile:          user.mobile || "",
      password:        user.password,
      confirmPassword: user.password, 
      role:            user.role, 
      status:          user.is_delete,       // ✅ was using wrong field
      image:           user.image_url || "", // ✅ show existing image in upload zone
      imageFile:       null
    })
    setEditingId(user.id)
    setEditOpen(true) 
}

  // Phase 1: Show Diff Comparison inside verification popup before committing 
  const initiateEditConfirm = () => {
    if (!editForm.name || !editForm.email) {
      showToast("Name and Email are required.", "error")
      return
    }
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      showToast("Passwords do not match.", "error")
      return
    }

    // Dynamic verification algorithm: Diffing changed properties
    const original = allUsers.find(u => u.id === editingId)
    const detectedChanges = []
    if (original) {
      if (original.name !== editForm.name) detectedChanges.push({ field: "Name", from: original.name, to: editForm.name })
      if (original.email !== editForm.email) detectedChanges.push({ field: "Email", from: original.email, to: editForm.email })
      if (original.role !== editForm.role) detectedChanges.push({ field: "Role", from: original.role, to: editForm.role })
      if (original.status !== editForm.status) detectedChanges.push({ field: "Status", from: original.status, to: editForm.status })
      if (original.phone !== editForm.phone) detectedChanges.push({ field: "Phone", from: original.phone || "empty", to: editForm.phone || "empty" })
      if (original.image !== editForm.image) detectedChanges.push({ field: "Profile Image", from: original.image ? "Uploaded image" : "Default", to: editForm.image ? "New upload" : "Default" })
    }

    if (detectedChanges.length === 0) {
      // Close automatically if nothing changed
      setEditOpen(false)
      showToast("No configuration changes detected.", "info")
      return
    }

    setConfirmState({
      open: true,
      type: "warning",
      title: "Confirm Profile Changes?",
      message: `Review all modified configurations for ${original.name} before saving.`,
      confirmLabel: "Apply Modifications",
      onCancel: () => setConfirmState(p => ({ ...p, open: false })),
      onConfirm: () => executeEditSave(detectedChanges),
      changes: detectedChanges
    })
  }

  // Phase 2: Apply changes and trigger visual receipt 
const executeEditSave = async (changesApplied) => {
    const formData = new FormData();
    formData.append("id",     editingId);
    formData.append("name",   editForm.name);
    formData.append("email",  editForm.email);
    formData.append("mobile", editForm.mobile);
    formData.append("role",   editForm.role);
    formData.append("status", editForm.status);

    if (editForm.password) {
        formData.append("password", editForm.password); // only if changed
    }

    // ✅ Send new file if uploaded, else keep existing
    if (editForm.imageFile) {
        formData.append("image", editForm.imageFile);
    }
     const Editres =  dispatch(EditNewUser(formData));

    setEditOpen(false)

    setConfirmState({
        open:         true,
        type:         "success",
        title:        "Profile Modifications Applied!",
        message:      `${editForm.name}'s account has been successfully updated.`,
        confirmLabel: "Return to Users",
        onConfirm:    () => setConfirmState(p => ({ ...p, open: false })),
        onCancel:     null,
        userPreview: {
            name:   editForm.name,
            email:  editForm.email,
            role:   editForm.role,
            image:  editForm.image  // ✅ base64 preview in success card
        }
    })
    showToast(`${editForm.name} profile modified.`)
}

  // ── FLOW: DELETE USER ─────────────────────────────────────────────────────
  const askDelete = (userId) => {
    const user = allUsers.find(u => u.id === userId)
    setConfirmState({
      open: true,
      type: "danger",
      title: `Permanently Delete ${user?.name || "User"}?`,
      message: "This operation is irreversible. The record and associated authentication details will be permanently wiped.",
      confirmLabel: "Delete Record",
      changes:      [],
      userPreview:  null,
      onCancel: () => {
          setConfirmState(p => ({ ...p, open: false }))
          showToast("Deletion canceled.", "error")
      },
      onConfirm: () => executeDelete(userId)
    })
  }

  const executeDelete = (userId) => {
    dispatch(deleteUser(userId))
    setConfirmState(p => ({ ...p, open: false }))
    showToast("User record permanently purged.", "success")
    dispatch(getAllUsers())
  }

  const updateFormField = (setter, key, val) => {
    setter(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-150">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Identity Center</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Verify credentials, roles, and status workflows.</p>
        </div>
        <button
          onClick={addnewUser}
          className="inline-flex items-center justify-center px-4.5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-150"
        >
          <span className="mr-2 text-lg font-light leading-none">+</span>
          Add User Account
        </button>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-2xl shadow-sm p-4  border-gray-150">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by profile name, email, assignment role, or status..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span>Rows per page:</span>
            <select
              value={pageSize === 0 ? "all" : String(pageSize)}
              onChange={handlePageSizeChange}
              className="border border-gray-250 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="text-xs font-medium text-gray-500">Registered: <span className="font-semibold text-gray-900">{totalCount}</span> Profiles</div>
        </div>
      </div>

      {/* ── Table Layout ── */}
      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                {["#", "User Profile", "Email Address", "Access Assignment", "Security Status", "Actions"].map((h, i) => (
                  <th key={h} className={`px-6 py-4.5 text-xs font-bold text-gray-400 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">
                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    No matching users found. Try modifying your search.
                  </td>
                </tr>
              )}
              {paginatedUsers.map((user, index) => {
                const rowNumber = pageSize === 0 ? index + 1 : (currentPage - 1) * pageSize + index + 1
                return (
                  <tr key={user.id} className="transition hover:bg-gray-50/40">
                    <td className="px-6 py-4.5 text-xs font-semibold text-gray-400">{rowNumber}</td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} image={user.image_url} />
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
                          <p className="text-xs text-gray-400 mt-1 font-medium">{user.phone || "No phone added"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-sm font-medium text-gray-600">{user.email}</td>
                    <td className="px-6 py-4.5 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                        user.role === "Admin" 
                          ? "bg-indigo-50 text-indigo-700" 
                          : user.role === "Editor" 
                            ? "bg-sky-50 text-sky-700" 
                            : "bg-gray-50 text-gray-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.is_delete === "Active" ? "bg-green-50 text-green-700 border border-green-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.is_delete === "Active" ? "bg-green-500" : "bg-rose-500"}`} />
                        {user.is_delete}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-sm text-right">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          onClick={() => openEdit(user)} 
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-indigo-150 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition transform hover:-translate-y-0.5"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => askDelete(user.id)} 
                          className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-rose-150 text-rose-700 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-200 transition transform hover:-translate-y-0.5"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pageSize !== 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-500 font-semibold">
            <div>Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span></div>
            <div className="flex items-center gap-1.5 justify-end">
              <button 
                onClick={() => goToPage(1)} 
                disabled={currentPage === 1}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition ${currentPage === 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm"}`}
              >
                &lt;&lt;
              </button>
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${currentPage === 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm"}`}
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1
                return (
                  <button 
                    key={page} 
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition ${page === currentPage ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold" : "border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm"}`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${currentPage === totalPages ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm"}`}
              >
                Next
              </button>
              <button 
                onClick={() => goToPage(totalPages)} 
                disabled={currentPage === totalPages}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition ${currentPage === totalPages ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm"}`}
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add User Modal Sheet ── */}
      <Modal open={addOpenModel} onClose={() => setAddOpenModel(false)}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-indigo-500">
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Create User Profile</h2>
            <p className="text-xs text-indigo-100 mt-0.5">Define general details, role mapping, and credentials.</p>
          </div>
          <button
            onClick={() => setAddOpenModel(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* File Upload Zone */}
          <FileUploadZone 
            initialValue={addForm.image} 
            /* onChange={(url) => updateFormField(setAddForm, "image", url)}  */
            onChange={({ url, file }) => {
                // ✅ Store both base64 and file
                setAddForm(prev => ({ 
                    ...prev, 
                    image: url,       // for preview in success card
                    imageFile: file   // for FormData upload
                }))
            }} 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => { updateFormField(setAddForm, "name", e.target.value);
                  setErrors(prev => ({ ...prev, name: "" }));
                }}
                placeholder="Alex Johnson"
                
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm ${ errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => updateFormField(setAddForm, "email", e.target.value)}
                placeholder="alex@example.com"
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm ${ errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && (<p className="text-red-500 text-xs mt-1">{errors.email}</p>)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Role Type</label>
              <select
                value={addForm.role}
                onChange={(e) => updateFormField(setAddForm, "role", e.target.value)}
                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm ${ errors.email ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              {errors.role && (<p className="text-red-500 text-xs mt-1">{errors.role}</p>)}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Mobile Number</label>
              <input
                type="text"
                value={addForm.mobile}
                onChange={(e) => updateFormField(setAddForm, "mobile", e.target.value)}
                placeholder="+1 (555) 000-0000"
                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm ${ errors.mobile ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.mobile && (<p className="text-red-500 text-xs mt-1">{errors.mobile}</p>)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Password</label>
              <input
                type="password"
                value={addForm.password}
                onChange={(e) => updateFormField(setAddForm, "password", e.target.value)}
                placeholder="••••••••"
                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm ${ errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && (<p className="text-red-500 text-xs mt-1">{errors.password}</p>)}
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Confirm Password</label>
              <input
                type="password"
                value={addForm.confirmPassword}
                onChange={(e) => updateFormField(setAddForm, "confirmPassword", e.target.value)}
                placeholder="••••••••"
                 className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm ${ errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.confirmPassword && (<p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={() => setAddOpenModel(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-150 transition animate-none"
          >
            Cancel
          </button>
          <button
            onClick={initiateAddConfirm}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            Save User
          </button>
        </div>
      </Modal>

      {/* ── Edit User Modal Sheet ── */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-indigo-500">
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Edit User Settings</h2>
            <p className="text-xs text-indigo-100 mt-0.5 font-medium">Modify credentials or security status maps.</p>
          </div>
          <button
            onClick={() => setEditOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
         
          <FileUploadZone 
              initialValue={editForm.image}   
              onChange={({ url, file }) => {  {/* ✅ Fixed: was receiving string, now object */}
                  setEditForm(prev => ({ 
                      ...prev, 
                      image:     url,   // base64 for preview
                      imageFile: file   // File object for FormData
                  }))
              }} 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => updateFormField(setEditForm, "name", e.target.value)}
                placeholder="Alex Johnson"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => updateFormField(setEditForm, "email", e.target.value)}
                placeholder="alex@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Role Type</label>
              <select
                value={editForm.role}
                onChange={(e) => updateFormField(setEditForm, "role", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Mobile Number</label>
              <input
                type="text"
                value={editForm.mobile}
                onChange={(e) => updateFormField(setEditForm, "mobile", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">New Password (Optional)</label>
              <input
                type="text"
                value={editForm.password}
                onChange={(e) => updateFormField(setEditForm, "password", e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">Confirm New Password</label>
              <input
                type="text"
                value={editForm.confirmPassword}
                onChange={(e) => updateFormField(setEditForm, "confirmPassword", e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={() => setEditOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-150 transition"
          >
            Cancel
          </button>
          <button
            onClick={initiateEditConfirm}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            Update User
          </button>
        </div>
      </Modal>

      {/* ── Confirm / Success Flow Modal ── */}
      <ConfirmDialog
        open={confirmState.open}
        type={confirmState.type}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={confirmState.onConfirm}
        onCancel={confirmState.onCancel}
        changes={confirmState.changes}
        userPreview={confirmState.userPreview}
      />

      {/* ── Toast notifications ── */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  )
}