document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // Supabase Configuration
  // ============================
  const SUPABASE_URL = 'https://kttsaxgbdrjaxzbmwond.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0dHNheGdiZHJqYXh6Ym13b25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NjY2ODAsImV4cCI6MjA5MjI0MjY4MH0.xGBfcVjR4gOdblx-7UXdj3iVx30TgVXSMxjM-vQE6Zg';

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ============================
  // DOM References
  // ============================
  const nameInput = document.getElementById('nameInput');
  const classInput = document.getElementById('classInput');
  const sectionInput = document.getElementById('sectionInput');
  const dobInput = document.getElementById('dobInput');
  const fatherInput = document.getElementById('fatherInput');
  const motherInput = document.getElementById('motherInput');
  const contactInput = document.getElementById('contactInput');
  const addressInput = document.getElementById('addressInput');
  const bloodInput = document.getElementById('bloodInput');
  const admissionInput = document.getElementById('admissionInput');
  const photoInput = document.getElementById('photoInput');
  const studentForm = document.getElementById('studentForm');

  const namePreview = document.getElementById('namePreview');
  const classPreview = document.getElementById('classPreview');
  const sectionPreview = document.getElementById('sectionPreview');
  const dobPreview = document.getElementById('dobPreview');
  const fatherPreview = document.getElementById('fatherPreview');
  const motherPreview = document.getElementById('motherPreview');
  const contactPreview = document.getElementById('contactPreview');
  const addressPreview = document.getElementById('addressPreview');
  const admissionPreview = document.getElementById('admissionPreview');
  const bloodPreview = document.getElementById('bloodPreview');
  const photoPreview = document.getElementById('photoPreview');

  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const fileUploadWrapper = document.getElementById('fileUploadWrapper');

  const toast = document.getElementById('toast');
  const toastError = document.getElementById('toastError');
  const submitBtn = document.getElementById('submitBtn');

  // Helper for formatting date yyyy-mm-dd to dd/mm/yyyy
  function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  }

  // ============================
  // Live Preview Updates
  // ============================
  nameInput.addEventListener('input', () => {
    namePreview.textContent = nameInput.value.trim() || 'Student Name';
  });

  function updateClassSection() {
    const c = classInput.value.trim();
    const s = sectionInput.value.trim();
    if (c || s) {
      classPreview.textContent = `Class - ${c} ${s}`.trim();
    } else {
      classPreview.textContent = 'Class - ';
    }
  }

  classInput.addEventListener('input', updateClassSection);
  sectionInput.addEventListener('input', updateClassSection);

  dobInput.addEventListener('input', () => {
    const val = formatDate(dobInput.value.trim());
    dobPreview.textContent = val ? `DOB - ${val}` : 'DOB - ';
  });

  fatherInput.addEventListener('input', () => {
    const val = fatherInput.value.trim();
    fatherPreview.textContent = val ? `Father Name - ${val}` : 'Father Name - ';
  });

  motherInput.addEventListener('input', () => {
    const val = motherInput.value.trim();
    motherPreview.textContent = val ? `Mother Name - ${val}` : 'Mother Name - ';
  });

  contactInput.addEventListener('input', () => {
    const val = contactInput.value.trim();
    contactPreview.textContent = val ? `Contact - ${val}` : 'Contact - ';
  });

  addressInput.addEventListener('input', () => {
    const val = addressInput.value.trim();
    addressPreview.textContent = val ? `Address - ${val}` : 'Address - ';
  });

  admissionInput.addEventListener('input', () => {
    const val = admissionInput.value.trim();
    admissionPreview.textContent = val ? `Admission No - ${val}` : 'Admission No - ';
  });

  bloodInput.addEventListener('input', () => {
    const val = bloodInput.value.trim();
    bloodPreview.textContent = val ? ` ${val}` : 'Blood Group - ';
  });

  // ============================
  // Photo Upload & Preview
  // ============================
  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      photoPreview.src = objectUrl;
      photoPreview.classList.add('visible');
      photoPlaceholder.classList.add('hidden');
      fileUploadWrapper.classList.add('active');
    }
  });

  // ============================
  // Validation
  // ============================
  function validateForm() {
    let isValid = true;
    const textInputs = [nameInput, classInput, sectionInput, dobInput, fatherInput, motherInput, contactInput, addressInput, bloodInput, admissionInput];

    // Check text inputs
    textInputs.forEach((input) => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group.classList.add('error');
        isValid = false;
      } else {
        group.classList.remove('error');
      }
    });

    return isValid;
  }

  // Clear error on input typing
  [nameInput, classInput, sectionInput, dobInput, fatherInput, motherInput, contactInput, addressInput, bloodInput, admissionInput].forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });

  photoInput.addEventListener('change', () => {
    const group = photoInput.closest('.form-group');
    if (group) group.classList.remove('error');
  });

  // ============================
  // Toast / Button Helpers
  // ============================
  function showToast(message, isError = false) {
    const targetToast = isError ? toastError : toast;
    targetToast.querySelector('.toast-msg').textContent = message;
    targetToast.classList.add('show');
    setTimeout(() => {
      targetToast.classList.remove('show');
    }, 3000);
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Submitting...';
      submitBtn.style.opacity = '0.7';
    } else {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Submit';
      submitBtn.style.opacity = '1';
    }
  }

  // ============================
  // Form Submit Setup
  // ============================
  window.submitForm = async function (e) {
    if (e) e.preventDefault();

    // Validate fields
    if (!validateForm()) {
      showToast('Please fill in all fields.', true);
      return;
    }

    // Photo specific check according to requirement (use alert if missing)
    const file = document.getElementById('photoInput').files[0];
    if (!file) {
      alert("Please select a photo");
      const photoGroup = photoInput.closest('.form-group');
      if (photoGroup) photoGroup.classList.add('error');
      return;
    }

    setLoading(true);

    try {
      const name = nameInput.value.trim();
      const studentClass = classInput.value.trim();
      const section = sectionInput.value.trim();
      const dob = dobInput.value.trim();
      const fatherName = fatherInput.value.trim();
      const motherName = motherInput.value.trim();
      const contact = contactInput.value.trim();
      const address = addressInput.value.trim();
      const bloodGroup = bloodInput.value.trim();
      const admissionNo = admissionInput.value.trim();

      // Step 1: Upload photo to Supabase Storage
      const safeName = name.replace(/\s+/g, '_');
      const safeAdmission = admissionNo.replace(/\s+/g, '_');
      const fileName = `${safeAdmission}_${safeName}.jpg`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-photos')
        .upload(`schoolA/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error('Photo upload failed');
      }

      // Setup photo string to simply be the filename
      const photoUrl = fileName;

      // Step 3: Insert data into students table
      const { error: insertError } = await supabase
        .from('students')
        .insert([{
          name: name,
          class: studentClass,
          section: section,
          dob: dob,
          father_name: fatherName,
          mother_name: motherName,
          contact: contact,
          address: address,
          blood_group: bloodGroup,
          admission_no: admissionNo,
          photo_url: photoUrl,

        }]);

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw new Error('Data insert failed');
      }

      // Success feedback
      console.log('✅ Student data submitted successfully');
      showToast('Submitted successfully');

      // Reset form
      setTimeout(() => {
        studentForm.reset();
        namePreview.textContent = 'Student Name';
        classPreview.textContent = '—';
        sectionPreview.textContent = '—';
        dobPreview.textContent = 'DOB - ';
        fatherPreview.textContent = 'Father Name - ';
        motherPreview.textContent = 'Mother Name - ';
        contactPreview.textContent = '—';
        addressPreview.textContent = '—';
        admissionPreview.textContent = 'Admission No - ';
        bloodPreview.textContent = '—';

        photoPreview.src = '';
        photoPreview.classList.remove('visible');
        photoPlaceholder.classList.remove('hidden');
        fileUploadWrapper.classList.remove('active');

        if (photoPreview.src && photoPreview.src.startsWith('blob:')) {
          URL.revokeObjectURL(photoPreview.src);
        }
      }, 1500);

    } catch (err) {
      console.error('❌ Submission Exception:', err);
      showToast('Something went wrong', true);
    } finally {
      setLoading(false);
    }
  };

});
