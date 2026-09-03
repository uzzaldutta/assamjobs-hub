import fs

for filename in ["src/lib/ingestion/adapters/JobAssamAdapter.ts", "src/lib/ingestion/adapters/AssamCareerAdapter.ts"]:
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We want to replace the normalization and extract logic to support dynamically mapping the content type
    
    # 1. Modify the extract function signature and return value to include detectedType
    content = content.replace("    const bodyText = $('.entry-content').text();", "    const bodyText = $('.entry-content').text();\n    const titleLower = title.toLowerCase();\n")
    content = content.replace("    const bodyText = $('.post-body').text();", "    const bodyText = $('.post-body').text();\n    const titleLower = title.toLowerCase();\n")
    
    # Insert detectedType before returning
    insertion = """
    let detectedType: 'JOB' | 'TENDER' | 'ADMISSION' | 'RESULT' | 'ADMIT_CARD' | 'SCHOLARSHIP' = 'JOB';
    if (titleLower.includes('result') || titleLower.includes('merit list')) detectedType = 'RESULT';
    else if (titleLower.includes('admit card') || titleLower.includes('call letter') || titleLower.includes('hall ticket')) detectedType = 'ADMIT_CARD';
    else if (titleLower.includes('admission')) detectedType = 'ADMISSION';
    else if (titleLower.includes('scholarship')) detectedType = 'SCHOLARSHIP';
    else if (titleLower.includes('tender')) detectedType = 'TENDER';
    """
    content = content.replace("    return {\n      title,", insertion + "\n    return {\n      title,\n      detectedType,")
    
    # 2. Modify the normalize function
    if "JobAssam" in filename:
        old_normalize = """  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url, // Original provenance link
      applyUrl: extracted.applyUrl || extracted.url, // Actionable link
      notificationUrl: extracted.notificationUrl,
      contentType: 'JOB',
      title: extracted.title,
      organization: extracted.organization,
      applicationEnd: extracted.lastDate,
      vacancy: extracted.vacancy,
      externalId: extracted.url
    };
  }"""
    else:
        old_normalize = """  async normalize(extracted: any): Promise<NormalizedPayload> {
    return {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url,
      applyUrl: extracted.applyUrl || extracted.url,
      notificationUrl: extracted.notificationUrl,
      contentType: 'JOB',
      title: extracted.title,
      organization: extracted.organization,
      applicationEnd: extracted.lastDate,
      vacancy: extracted.vacancy,
      externalId: extracted.url
    };
  }"""
        
    new_normalize = """  async normalize(extracted: any): Promise<NormalizedPayload> {
    const payload: NormalizedPayload = {
      source: this.sourceConfig.source_name,
      sourceUrl: extracted.url,
      applyUrl: extracted.applyUrl || undefined,
      notificationUrl: extracted.notificationUrl,
      contentType: extracted.detectedType || 'JOB',
      title: extracted.title,
      organization: extracted.organization,
      externalId: extracted.url
    };

    if (payload.contentType === 'JOB') {
        payload.applicationEnd = extracted.lastDate;
        payload.vacancy = extracted.vacancy;
    } else if (payload.contentType === 'ADMIT_CARD' || payload.contentType === 'RESULT') {
        payload.examName = extracted.title;
        payload.resultDate = extracted.lastDate;
        payload.releaseDate = extracted.lastDate;
    }

    return payload;
  }"""
    
    content = content.replace(old_normalize, new_normalize)
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
