# Core Scanner - NPM Package
This is a repo to add code which can be shared across all our nestjs Recite Me Scanner services. Any shared code can be created, updated and used here. This will make us more productive not having to make updates across multiple scanners at once.

## Features:

### Opening a Puppeteer Browser instance
Open puppeteer with the correct flags.

### Analyse Accessibility Issues
Use the abstract analyser class to find accessiblity issues.

### Queuing at Scale
Use Bull MQ to process many or CPU intensive jobs with a dynamic queue processor.

### Journey Scans
Send custom user instructions to allow for journey scans applying user actions in puppeteer to interact with a puppeteer page. -- not yet implemented