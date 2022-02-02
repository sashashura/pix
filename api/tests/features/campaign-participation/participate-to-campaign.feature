Feature: participer à une campagne
  En tant que participant
  Je veux participer à une campagne
  et je veux voir mes résultats

  Scenario: Participation à une campagne
    Etant donné le référentiel suivant
      | Domaine 1 | Competence 1.1 | Sujet 1.1.1 | Acquis 1.1.1.1 |
      | Domaine 1 | Competence 1.1 | Sujet 1.1.1 | Acquis 1.1.1.2 |
      | Domaine 1 | Competence 1.1 | Sujet 1.1.2 | Acquis 1.1.2.1 |
      | Domaine 1 | Competence 1.2 | Sujet 1.2.1 | Acquis 1.2.1.1 |
      | Domaine 2 | Competence 2.1 | Sujet 2.1.1 | Acquis 2.1.1.1 |
    Et qu'il y a une campagne d'évaluation pour les acquis
      | Acquis 1.1.1.1 |
      | Acquis 1.1.1.2 |
      | Acquis 1.1.2.1 |
      | Acquis 2.1.1.1 |
    Et que je participe à la campagne
    Quand je répond correctement aux questions sur les acquis
      | Acquis 1.1.1.2 |
      | Acquis 1.1.2.1 |
    Alors je maitrise 50% des acquis de la campagne

